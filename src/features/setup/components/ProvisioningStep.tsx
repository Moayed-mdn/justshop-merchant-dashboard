'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { useProvisioningStatus } from '@/hooks/auth/useProvisioningStatus';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { isBootstrapStoreReady } from '@/lib/auth/bootstrap-routing';
import { useRouter } from '@/lib/navigation';
import { ROUTES } from '@/config/routes';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Loader2,
  RefreshCcw,
  WifiOff,
} from 'lucide-react';

/**
 * Maps backend current_step values to human-readable lifecycle labels.
 * Steps are shown as a progressive checklist during provisioning.
 */
const LIFECYCLE_STEPS = [
  { key: 'initializing_store',        label: 'Creating store' },
  { key: 'provisioning_workspace',    label: 'Provisioning workspace' },
  { key: 'applying_configuration',    label: 'Applying starter configuration' },
  { key: 'finalizing_setup',          label: 'Finalizing setup' },
] as const;

type LifecycleStepKey = typeof LIFECYCLE_STEPS[number]['key'];

function resolveLifecycleIndex(currentStep: string | null): number {
  if (!currentStep) return 0;
  const idx = LIFECYCLE_STEPS.findIndex((s) => s.key === currentStep);
  return idx >= 0 ? idx : 0;
}

function formatStep(step: string): string {
  return step
    .split('_')
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

export function ProvisioningStep() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const completedRefreshRef = useRef(false);

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

  const storeName = bootstrap?.active_store?.name ?? bootstrap?.stores?.[0]?.name ?? null;

  const status = provisioning?.status ?? 'pending';
  const progress = provisioning?.progress ?? 0;
  const message = provisioning?.message ?? null;
  const currentStep = provisioning?.current_step ?? null;
  const lastCheckedAt = provisioning?.last_checked_at
    ? new Date(provisioning.last_checked_at).toLocaleTimeString()
    : null;

  const lifecycleIndex = resolveLifecycleIndex(currentStep);

  const heading = useMemo(() => {
    if (status === 'completed') return 'Store is ready';
    if (status === 'failed') return 'Setup needs attention';
    if (storeName) return `Setting up ${storeName}...`;
    return 'Setting up your store...';
  }, [status, storeName]);

  const subheading = useMemo(() => {
    if (!isOnline) return 'You are offline. Setup will resume when your connection returns.';
    if (isError) return error?.message ?? 'The latest status check failed. You can safely try again.';
    if (status === 'failed') return message || 'Provisioning stopped before the store became ready.';
    if (hardTimedOut) return 'Provisioning is taking longer than expected. Polling has paused — retry manually.';
    if (softTimedOut) return 'Still running. The app will keep checking in the background.';
    if (status === 'completed') return 'Your store is provisioned and ready to use.';
    return message ?? 'This usually takes less than a minute.';
  }, [error?.message, hardTimedOut, isError, isOnline, message, softTimedOut, status]);

  const refreshBootstrap = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
  };

  // Trigger bootstrap refresh once when provisioning completes
  useEffect(() => {
    if (status !== 'completed') {
      completedRefreshRef.current = false;
      return;
    }
    if (bootstrap?.active_store && isBootstrapStoreReady(bootstrap.active_store)) {
      completedRefreshRef.current = false;
      return;
    }
    if (completedRefreshRef.current) return;
    completedRefreshRef.current = true;
    void refreshBootstrap();
  }, [bootstrap?.active_store, status]);

  // Redirect to dashboard once store is ready
  useEffect(() => {
    if (
      status !== 'completed' ||
      !bootstrap?.active_store ||
      !isBootstrapStoreReady(bootstrap.active_store)
    ) {
      return;
    }
    router.push(ROUTES.store(String(bootstrap.active_store.id)).dashboard());
  }, [bootstrap?.active_store, router, status]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <div className="mx-auto w-full max-w-lg space-y-8">
        {/* Status icon */}
        <div className="flex justify-center">
          <div className="relative flex h-20 w-20 items-center justify-center">
            {status === 'completed' ? (
              <CheckCircle2 className="h-14 w-14 text-green-500" />
            ) : status === 'failed' || isError ? (
              <AlertCircle className="h-14 w-14 text-destructive" />
            ) : hardTimedOut ? (
              <Clock3 className="h-14 w-14 text-amber-500" />
            ) : !isOnline ? (
              <WifiOff className="h-14 w-14 text-amber-500" />
            ) : (
              <>
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                <Loader2 className="h-14 w-14 animate-spin text-primary" />
              </>
            )}
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">{heading}</h1>
          <p className="text-muted-foreground">{subheading}</p>
          {lastCheckedAt ? (
            <p className="text-xs text-muted-foreground">Last checked at {lastCheckedAt}</p>
          ) : null}
        </div>

        {/* Progress bar */}
        {status !== 'completed' && status !== 'failed' && !isError ? (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-center text-xs text-muted-foreground">{progress}% complete</p>
          </div>
        ) : null}

        {/* Lifecycle checklist */}
        {status !== 'failed' && !isError ? (
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <ul className="space-y-3">
              {LIFECYCLE_STEPS.map((step, idx) => {
                const isDone = status === 'completed' || idx < lifecycleIndex;
                const isActive = idx === lifecycleIndex && status !== 'completed';
                return (
                  <li key={step.key} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                      {isDone ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : isActive ? (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                      )}
                    </div>
                    <span
                      className={
                        isDone
                          ? 'text-sm font-medium text-foreground'
                          : isActive
                            ? 'text-sm font-medium text-foreground'
                            : 'text-sm text-muted-foreground'
                      }
                    >
                      {step.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        {/* Recovery guidance */}
        {(softTimedOut || hardTimedOut || status === 'failed' || isError) ? (
          <div className="rounded-xl border border-border bg-muted/40 p-4 text-left">
            <h3 className="font-semibold">Recovery guidance</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Use "Check again" to retry the provisioning status poll.</li>
              <li>Use "Refresh bootstrap" after the backend finishes or after access changes.</li>
              <li>Do not resubmit store creation unless the backend confirms the store was never created.</li>
              <li>If this screen remains stuck after repeated retries, contact support.</li>
            </ul>
          </div>
        ) : null}

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button type="button" variant="outline" onClick={() => void refetch()}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Check again
          </Button>
          <Button type="button" variant="outline" onClick={() => void refreshBootstrap()}>
            Refresh bootstrap
          </Button>
          {status === 'completed' &&
          bootstrap?.active_store &&
          isBootstrapStoreReady(bootstrap.active_store) ? (
            <Button
              type="button"
              onClick={() =>
                router.push(ROUTES.store(String(bootstrap.active_store!.id)).dashboard())
              }
            >
              Open dashboard
            </Button>
          ) : null}
        </div>

        {trackedStoreId ? (
          <p className="text-center text-xs text-muted-foreground">
            Tracking store #{trackedStoreId}
            {isFetching ? ' · Checking...' : null}
            {!isDocumentVisible ? ' · Paused in background' : null}
          </p>
        ) : null}
      </div>
    </div>
  );
}
