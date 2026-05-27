'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getProvisioningStatus } from '@/lib/api/stores';
import { queryKeys } from '@/lib/queryKeys';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import {
  needsProvisioningFlow,
  normalizeBackendRedirectPath,
  resolveProvisioningStoreId,
} from '@/lib/auth/bootstrap-routing';
import type { ApiError } from '@/types/api';
import { useRouter } from '@/lib/navigation';
import { ROUTES } from '@/config/routes';
import { postAuthChannelMessage } from '@/lib/auth/channel';

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

function isEmptyPendingProvisioningPayload(value: {
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  current_step: string | null;
  message: string | null;
  retryable: boolean;
}): boolean {
  return (
    value.status === 'pending' &&
    value.progress === 0 &&
    value.current_step === null &&
    value.message === null
  );
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
    if (typeof document === 'undefined' || typeof window === 'undefined') return;

    const onVisibilityChange = () => setIsDocumentVisible(document.visibilityState === 'visible');
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);

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
    queryKey: trackedStoreId
      ? queryKeys.merchant.store(String(trackedStoreId)).provisioning()
      : ['provisioning-status', 'idle'],
    queryFn: ({ signal }) => getProvisioningStatus(String(trackedStoreId), { signal }),
    enabled: shouldPoll,
    refetchInterval: () => {
      if (!shouldPoll || !isDocumentVisible || !isOnline) return false;

      const snapshot = useBootstrapStore.getState().provisioning;
      const snapshotStartedAt = snapshot?.started_at;
      if (!snapshotStartedAt) return 2_000;

      const elapsed = Date.now() - snapshotStartedAt;
      if (elapsed < 60_000) return 2_000;
      if (elapsed < 5 * 60_000) return 5_000;
      if (elapsed < HARD_TIMEOUT_MS) return 10_000;
      return false;
    },
    retry: (failureCount, error) => {
      const apiError = error as unknown as ApiError;
      if (apiError.status === 403 || apiError.status === 404) return false;
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
  });

  // Tick clock for timeout calculations
  useEffect(() => {
    if (!trackedStoreId || !startedAt) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(timer);
  }, [startedAt, trackedStoreId]);

  // Refetch when coming back online or tab becomes visible
  useEffect(() => {
    if (!trackedStoreId || !shouldPoll) return;
    if (isDocumentVisible && isOnline) void query.refetch();
  }, [isDocumentVisible, isOnline, query.refetch, shouldPoll, trackedStoreId]);

  // Sync timeout flags into provisioning state
  useEffect(() => {
    if (!trackedStoreId) return;
    setProvisioning({
      tracked_store_id: trackedStoreId,
      started_at: startedAt ?? Date.now(),
      soft_timed_out: softTimedOut,
      hard_timed_out: hardTimedOut,
    });
  }, [hardTimedOut, setProvisioning, softTimedOut, startedAt, trackedStoreId]);

  // Process provisioning status response
  useEffect(() => {
    const payload = query.data?.data;
    if (!payload || !trackedStoreId) return;

    if (!isProvisioningPayload(payload)) {
      setProvisioning({
        tracked_store_id: trackedStoreId,
        status: 'failed',
        progress: provisioning?.progress ?? 0,
        current_step: 'malformed_payload',
        message:
          'Provisioning status could not be restored from the server response. Try checking again.',
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
      setProvisioning({
        tracked_store_id: trackedStoreId,
        status: 'failed',
        progress: 0,
        current_step: 'provisioning_not_started',
        message:
          'Provisioning has not started on the server yet. Please check the backend worker or retry after recovery.',
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
      void queryClient
        .fetchQuery({
          queryKey: queryKeys.merchant.me(),
          queryFn: ({ signal }) => fetchBootstrap({ signal }),
        })
        .then(() => postAuthChannelMessage('bootstrap-refresh'))
        .catch(() => void queryClient.invalidateQueries({ queryKey: queryKeys.merchant.me() }));
    }
  }, [
    bootstrap?.active_store,
    bootstrap?.onboarding.is_completed,
    fetchBootstrap,
    provisioning?.started_at,
    provisioning?.status,
    query.data,
    queryClient,
    setProvisioning,
    trackedStoreId,
  ]);

  // Handle query errors
  useEffect(() => {
    if (!query.error) return;
    const apiError = query.error as unknown as ApiError;
    const message = apiError.message?.toLowerCase() ?? '';
    const isContaminated = message.includes('session contamination') || message.includes('domain mismatch');

    if (apiError.status === 401 || isContaminated) {
      void queryClient.invalidateQueries({ queryKey: queryKeys.merchant.me() });
      return;
    }

    if (apiError.status === 403) {
      void queryClient.invalidateQueries({ queryKey: queryKeys.merchant.me() });
      
      // If the backend provided a specific redirect, follow it.
      // Otherwise, do NOT redirect to /dashboard automatically as it causes infinite loops
      // if the bootstrap state still requires provisioning.
      if (apiError.redirect) {
        router.push(normalizeBackendRedirectPath(apiError.redirect)!);
      }
      return;
    }

    if (apiError.status === 404) {
      void queryClient.invalidateQueries({ queryKey: queryKeys.merchant.me() });
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
