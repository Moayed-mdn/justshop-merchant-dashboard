'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getProvisioningStatus } from '@/lib/api/stores';
import { queryKeys } from '@/lib/queryKeys';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { needsProvisioningFlow, normalizeBackendRedirectPath, resolveProvisioningStoreId } from '@/lib/auth/bootstrap-routing';
import type { ApiError } from '@/types/api';
import { useRouter } from '@/lib/navigation';
import { ROUTES } from '@/config/routes';
import { postAuthChannelMessage } from '@/lib/auth/channel';

const debugLog = (event: string, data: any = {}) => {
  if (typeof window === 'undefined') return;
  fetch('http://127.0.0.1:9999/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, data, timestamp: Date.now(), source: 'useProvisioningStatus' })
  }).catch(() => {});
};

const STALLED_PENDING_TIMEOUT_MS = 90 * 1000;
const SOFT_TIMEOUT_MS = 2 * 60 * 1000;
const HARD_TIMEOUT_MS = 10 * 60 * 1000;

function isProvisioningPayload(
  value: unknown
): value is {
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  current_step: string | null;
  message: string | null;
  retryable: boolean;
} {
  return (
    typeof value === 'object' &&
    value !== null &&
    'status' in value &&
    'progress' in value &&
    'current_step' in value &&
    'message' in value &&
    'retryable' in value &&
    (value.status === 'pending' ||
      value.status === 'running' ||
      value.status === 'completed' ||
      value.status === 'failed') &&
    typeof value.progress === 'number' &&
    (typeof value.current_step === 'string' || value.current_step === null) &&
    (typeof value.message === 'string' || value.message === null) &&
    typeof value.retryable === 'boolean'
  );
}

function isEmptyPendingProvisioningPayload(
  value: {
    status: 'pending' | 'running' | 'completed' | 'failed';
    progress: number;
    current_step: string | null;
    message: string | null;
    retryable: boolean;
  }
): boolean {
  return value.status === 'pending' && value.progress === 0 && value.current_step === null && value.message === null;
}

export function useProvisioningStatus() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const bootstrap = useBootstrapStore((state) => state.bootstrap);
  const provisioning = useBootstrapStore((state) => state.provisioning);
  const setProvisioning = useBootstrapStore((state) => state.setProvisioning);
  const fetchBootstrap = useBootstrapStore((state) => state.fetchBootstrap);
  const [now, setNow] = useState(() => Date.now());
  const [isDocumentVisible, setIsDocumentVisible] = useState(
    () => typeof document === 'undefined' || document.visibilityState === 'visible'
  );
  const [isOnline, setIsOnline] = useState(
    () => typeof navigator === 'undefined' || navigator.onLine
  );

  const trackedStoreId = useMemo(
    () => provisioning?.tracked_store_id ?? resolveProvisioningStoreId(bootstrap),
    [bootstrap, provisioning?.tracked_store_id]
  );
  const startedAt = provisioning?.started_at;
  const elapsedMs = startedAt ? Math.max(0, now - startedAt) : 0;
  const softTimedOut = Boolean(startedAt && elapsedMs >= SOFT_TIMEOUT_MS);
  const hardTimedOut = Boolean(startedAt && elapsedMs >= HARD_TIMEOUT_MS);
  const shouldPoll =
    Boolean(trackedStoreId) &&
    needsProvisioningFlow(bootstrap, provisioning) &&
    provisioning?.status !== 'completed' &&
    provisioning?.status !== 'failed' &&
    !hardTimedOut;

  useEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      return;
    }

    const onVisibilityChange = () => {
      setIsDocumentVisible(document.visibilityState === 'visible');
    };

    const onOnline = () => {
      setIsOnline(true);
    };

    const onOffline = () => {
      setIsOnline(false);
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  const query = useQuery({
    queryKey: trackedStoreId ? queryKeys.auth.provisioning(trackedStoreId) : ['provisioning-status', 'idle'],
    queryFn: ({ signal }) => {
      debugLog('useProvisioningStatus_QueryFn_Triggered', { trackedStoreId });
      return getProvisioningStatus(String(trackedStoreId), { signal });
    },
    enabled: shouldPoll,
    refetchInterval: () => {
      if (!shouldPoll || !isDocumentVisible || !isOnline) {
        return false;
      }

      const snapshot = useBootstrapStore.getState().provisioning;
      const snapshotStartedAt = snapshot?.started_at;
      if (!snapshotStartedAt) {
        return 2_000;
      }

      const snapshotElapsedMs = Date.now() - snapshotStartedAt;
      if (snapshotElapsedMs < 60_000) {
        return 2_000;
      }

      if (snapshotElapsedMs < 5 * 60_000) {
        return 5_000;
      }

      if (snapshotElapsedMs < HARD_TIMEOUT_MS) {
        return 10_000;
      }

      return false;
    },
    retry: (failureCount, error) => {
      const apiError = error as unknown as ApiError;

      if (apiError.status === 403 || apiError.status === 404) {
        return false;
      }

      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!trackedStoreId || !startedAt) {
      return;
    }

    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1_000);

    return () => window.clearInterval(timer);
  }, [startedAt, trackedStoreId]);

  useEffect(() => {
    if (!trackedStoreId || !shouldPoll) {
      return;
    }

    if (isDocumentVisible && isOnline) {
      debugLog('useProvisioningStatus_ManualRefetch_Triggered', { isDocumentVisible, isOnline });
      void query.refetch();
    }
  }, [isDocumentVisible, isOnline, query.refetch, shouldPoll, trackedStoreId]);

  useEffect(() => {
    if (!trackedStoreId) {
      return;
    }

    debugLog('useProvisioningStatus_SetProvisioning_Effect', { softTimedOut, hardTimedOut, startedAt, trackedStoreId });
    setProvisioning({
      tracked_store_id: trackedStoreId,
      started_at: startedAt ?? Date.now(),
      soft_timed_out: softTimedOut,
      hard_timed_out: hardTimedOut,
    });
  }, [hardTimedOut, setProvisioning, softTimedOut, startedAt, trackedStoreId]);

  useEffect(() => {
    const payload = query.data?.data;
    if (!payload || !trackedStoreId) {
      return;
    }

    debugLog('useProvisioningStatus_DataUpdate_Effect', { status: payload.status, progress: payload.progress });

    if (!isProvisioningPayload(payload)) {
      setProvisioning({
        tracked_store_id: trackedStoreId,
        status: 'failed',
        progress: provisioning?.progress ?? 0,
        current_step: 'malformed_payload',
        message: 'Provisioning status could not be restored from the server response. Try checking again.',
        retryable: true,
        last_checked_at: Date.now(),
        started_at: provisioning?.started_at ?? Date.now(),
      });
      return;
    }

    const trackedStartedAt = provisioning?.started_at ?? Date.now();
    const trackedElapsedMs = Date.now() - trackedStartedAt;

    if (
      isEmptyPendingProvisioningPayload(payload) &&
      trackedElapsedMs >= STALLED_PENDING_TIMEOUT_MS &&
      Boolean(bootstrap?.onboarding.is_completed || bootstrap?.active_store)
    ) {
      debugLog('useProvisioningStatus_StalledPending_Detected', { trackedStoreId, trackedElapsedMs });
      setProvisioning({
        tracked_store_id: trackedStoreId,
        status: 'failed',
        progress: 0,
        current_step: 'provisioning_not_started',
        message: 'Provisioning has not started on the server yet. Please check the backend worker or retry after recovery.',
        retryable: true,
        last_checked_at: Date.now(),
        soft_timed_out: true,
        hard_timed_out: false,
        started_at: trackedStartedAt,
      });
      return;
    }

    setProvisioning({
      tracked_store_id: trackedStoreId,
      status: payload.status,
      progress: payload.progress,
      current_step: payload.current_step,
      message: payload.message,
      retryable: payload.retryable,
      last_checked_at: Date.now(),
      soft_timed_out: trackedElapsedMs >= SOFT_TIMEOUT_MS,
      hard_timed_out: trackedElapsedMs >= HARD_TIMEOUT_MS,
      started_at: trackedStartedAt,
    });

    if (payload.status === 'completed' && provisioning?.status !== 'completed') {
      debugLog('useProvisioningStatus_Completion_Triggered_BootstrapFetch');
      void queryClient
        .fetchQuery({
          queryKey: queryKeys.auth.me(),
          queryFn: ({ signal }) => fetchBootstrap({ signal }),
        })
        .then(() => {
          postAuthChannelMessage('bootstrap-refresh');
        })
        .catch(() => {
          void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
        });
    }
  }, [bootstrap?.active_store, bootstrap?.onboarding.is_completed, fetchBootstrap, provisioning?.started_at, provisioning?.status, query.data, queryClient, setProvisioning, trackedStoreId]);

  useEffect(() => {
    if (!query.error) {
      return;
    }

    const apiError = query.error as unknown as ApiError;
    if (apiError.status === 403) {
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
      router.push(normalizeBackendRedirectPath(apiError.redirect) ?? ROUTES.dashboard.home());
      return;
    }

    if (apiError.status === 404) {
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
    }
  }, [query.error, queryClient, router]);

  return {
    ...query,
    trackedStoreId,
    softTimedOut,
    hardTimedOut,
    isDocumentVisible,
    isOnline,
  };
}
