'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useBootstrapStore } from '@/stores/bootstrapStore';

const debugLog = (event: string, data: any = {}) => {
  if (typeof window === 'undefined') return;
  fetch('http://127.0.0.1:9999/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, data, timestamp: Date.now(), source: 'ProvisioningScreen' })
  }).catch(() => {});
};
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle2, Clock3, Loader2, RefreshCcw, WifiOff } from 'lucide-react';
import { useProvisioningStatus } from '@/hooks/auth/useProvisioningStatus';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';
import { useRouter } from '@/lib/navigation';
import { Badge } from '@/components/ui/badge';
import { isBootstrapStoreReady } from '@/lib/auth/bootstrap-routing';

function formatProvisioningStep(step: string): string {
  return step
    .split('_')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

export function ProvisioningScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const completedBootstrapRefreshRequestedRef = useRef(false);
  const provisioning = useBootstrapStore((state) => state.provisioning);
  const bootstrap = useBootstrapStore((state) => state.bootstrap);
  const {
    refetch,
    isError,
    error,
    trackedStoreId,
    softTimedOut,
    hardTimedOut,
    isFetching,
    isDocumentVisible,
    isOnline,
  } = useProvisioningStatus();

  useEffect(() => {
    debugLog('ProvisioningScreen_Mount', { 
      status: provisioning?.status,
      trackedStoreId
    });
    return () => debugLog('ProvisioningScreen_Unmount');
  }, []);

  const status = provisioning?.status ?? 'pending';
  const progress = provisioning?.progress ?? 0;
  const message = provisioning?.message ?? 'Provisioning is in progress.';
  const currentStep = provisioning?.current_step ?? 'initializing_store';
  const lastCheckedAt = provisioning?.last_checked_at
    ? new Date(provisioning.last_checked_at).toLocaleTimeString()
    : null;

  const title = useMemo(() => {
    if (status === 'completed') {
      return 'Store provisioning completed';
    }

    if (status === 'failed') {
      return 'Store provisioning needs attention';
    }

    return 'Provisioning your store';
  }, [status]);

  const statusBadge = useMemo(() => {
    if (status === 'completed') {
      return <Badge>Completed</Badge>;
    }

    if (status === 'failed') {
      return <Badge variant="destructive">Failed</Badge>;
    }

    if (hardTimedOut) {
      return <Badge variant="outline">Timed out</Badge>;
    }

    if (status === 'running') {
      return <Badge variant="secondary">Running</Badge>;
    }

    return <Badge variant="outline">Pending</Badge>;
  }, [hardTimedOut, status]);

  const subtitle = useMemo(() => {
    if (!isOnline) {
      return 'You are offline. The app will resume checking as soon as your connection returns.';
    }

    if (isError) {
      return error?.message ?? 'The latest provisioning check failed. You can safely try again.';
    }

    if (status === 'failed') {
      return message || 'Provisioning stopped before the store became ready.';
    }

    if (hardTimedOut) {
      return 'Provisioning is taking longer than expected. Automatic polling has paused so you can retry manually without spamming the backend.';
    }

    if (softTimedOut) {
      return 'Provisioning is still running. The app will keep checking in the background.';
    }

    return message;
  }, [error?.message, hardTimedOut, isError, isOnline, message, softTimedOut, status]);

  const refreshBootstrap = async () => {
    debugLog('ProvisioningScreen_RefreshBootstrap_Triggered');
    await queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
  };

  useEffect(() => {
    if (status !== 'completed') {
      completedBootstrapRefreshRequestedRef.current = false;
      return;
    }

    if (bootstrap?.active_store && isBootstrapStoreReady(bootstrap.active_store)) {
      completedBootstrapRefreshRequestedRef.current = false;
      return;
    }

    if (completedBootstrapRefreshRequestedRef.current) {
      return;
    }

    completedBootstrapRefreshRequestedRef.current = true;
    void refreshBootstrap();
  }, [bootstrap?.active_store, status]);

  useEffect(() => {
    if (status !== 'completed' || !bootstrap?.active_store || !isBootstrapStoreReady(bootstrap.active_store)) {
      return;
    }

    router.push(ROUTES.store(String(bootstrap.active_store.id)).dashboard());
  }, [bootstrap?.active_store, router, status]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center space-y-8 p-8 text-center">
      <div className="relative flex h-24 w-24 items-center justify-center">
        {status === 'completed' ? (
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        ) : status === 'failed' || isError ? (
          <AlertCircle className="h-16 w-16 text-destructive" />
        ) : hardTimedOut ? (
          <Clock3 className="h-16 w-16 text-amber-500" />
        ) : !isOnline ? (
          <WifiOff className="h-16 w-16 text-amber-500" />
        ) : (
          <>
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2">
          {statusBadge}
          {!isDocumentVisible ? <Badge variant="outline">Paused in background</Badge> : null}
          {isFetching ? <Badge variant="outline">Checking</Badge> : null}
        </div>
        <h2 className="text-2xl font-bold">
          {title}
        </h2>
        <p className="text-muted-foreground">{subtitle}</p>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Current step: {formatProvisioningStep(currentStep)}
        </p>
        {lastCheckedAt ? (
          <p className="text-xs text-muted-foreground">Last checked at {lastCheckedAt}</p>
        ) : null}
      </div>

      {!isError && status !== 'completed' && (
        <div className="w-full max-w-md space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">{progress}% completed</p>
        </div>
      )}

      {(softTimedOut || hardTimedOut || status === 'failed' || isError || !isOnline) && (
        <div className="w-full max-w-2xl rounded-xl border border-border bg-muted/40 p-4 text-left">
          <h3 className="font-semibold">Recovery guidance</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Use “Check again” to retry the safe provisioning status poll.</li>
            <li>Use “Refresh bootstrap” after the backend finishes or after access changes.</li>
            <li>Do not resubmit store creation unless the backend explicitly confirms the store was never created.</li>
            <li>If this screen remains stuck after repeated retries, treat it as a backend recovery or support case.</li>
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button type="button" variant="outline" onClick={() => void refetch()}>
          <RefreshCcw className="h-4 w-4" />
          Check again
        </Button>
        <Button type="button" variant="outline" onClick={() => void refreshBootstrap()}>
          Refresh bootstrap
        </Button>
        {status === 'completed' && bootstrap?.active_store && isBootstrapStoreReady(bootstrap.active_store) ? (
          <Button type="button" onClick={() => router.push(ROUTES.store(String(bootstrap.active_store!.id)).dashboard())}>
            Open dashboard
          </Button>
        ) : null}
        {trackedStoreId ? (
          <p className="w-full text-xs text-muted-foreground">Tracking store #{trackedStoreId}</p>
        ) : null}
      </div>
    </div>
  );
}
