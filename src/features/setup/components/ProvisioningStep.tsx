'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { useProvisioningStatus } from '@/hooks/auth/useProvisioningStatus';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { isBootstrapStoreReady } from '@/lib/auth/bootstrap-routing';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SetupCompleteStep } from './SetupCompleteStep';
import { logUXEvent } from '@/lib/ux-events';
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
  { key: 'initializing_store',        label: 'Creating your store' },
  { key: 'provisioning_workspace',    label: 'Setting up your workspace' },
  { key: 'applying_configuration',    label: 'Applying your starter settings' },
  { key: 'finalizing_setup',          label: 'Almost done' },
] as const;

function resolveLifecycleIndex(currentStep: string | null): number {
  if (!currentStep) return 0;
  const idx = LIFECYCLE_STEPS.findIndex((s) => s.key === currentStep);
  return idx >= 0 ? idx : 0;
}

export function ProvisioningStep() {
  const queryClient = useQueryClient();
  const completedRefreshRef = useRef(false);
  const hasLoggedMount = useRef(false);

  const provisioning = useBootstrapStore((state) => state.provisioning);
  const bootstrap = useBootstrapStore((state) => state.bootstrap);

  const {
    refetch,
    isError,
    error,
    softTimedOut,
    hardTimedOut,
    isOnline,
  } = useProvisioningStatus();

  const storeName = bootstrap?.active_store?.name ?? bootstrap?.stores?.[0]?.name ?? null;

  const status = provisioning?.status ?? 'pending';
  const progress = provisioning?.progress ?? 0;
  const message = provisioning?.message ?? null;
  const currentStep = provisioning?.current_step ?? null;

  const lifecycleIndex = resolveLifecycleIndex(currentStep);

  const heading = useMemo(() => {
    if (status === 'completed') return 'Your store is ready!';
    if (status === 'failed') return 'We hit a small snag';
    if (storeName) return `Setting up ${storeName}...`;
    return 'Setting up your store...';
  }, [status, storeName]);

  const subheading = useMemo(() => {
    if (!isOnline) return 'You are offline. Setup will resume when your connection returns.';
    if (isError) return error?.message ?? 'We couldn\u2019t check the latest status. You can safely try again.';
    if (status === 'failed') return message || 'Setup stopped before the store became ready. You can try again below.';
    if (hardTimedOut) return 'Setup is taking a bit longer than usual. You can check again whenever you\u2019re ready.';
    if (softTimedOut) return 'Still setting things up. We\u2019ll keep checking for you.';
    if (status === 'completed') return 'Everything is set up and ready to go.';
    return message ?? 'This usually takes less than a minute.';
  }, [error?.message, hardTimedOut, isError, isOnline, message, softTimedOut, status]);

  // Log provisioning mount once
  useEffect(() => {
    if (hasLoggedMount.current) return;
    if (status === 'pending' || status === 'running') {
      hasLoggedMount.current = true;
      logUXEvent('provisioning:mount');
    }
  }, [status]);

  // Log provisioning complete once and trigger bootstrap refresh
  useEffect(() => {
    if (status === 'completed' && !completedRefreshRef.current) {
      logUXEvent('provisioning:complete', { duration: provisioning?.progress ?? undefined });
    }
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
    void queryClient.invalidateQueries({ queryKey: queryKeys.merchant.me() });
  }, [queryClient, bootstrap?.active_store, status]);

  // Show the completion handoff screen when provisioning is done
  if (status === 'completed' && bootstrap?.active_store && isBootstrapStoreReady(bootstrap.active_store)) {
    return <SetupCompleteStep />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <div className="mx-auto w-full max-w-lg space-y-8">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </span>
          <span className="h-px w-6 bg-primary" />
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </span>
          <span className="h-px w-6 bg-primary" />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
            <span>3</span>
            <span className="hidden sm:inline">Setup</span>
          </span>
        </div>

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

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button type="button" variant="outline" onClick={() => void refetch()}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Check again
          </Button>
        </div>

        {/* Recovery help — shown only when something needs attention */}
        {(softTimedOut || hardTimedOut || status === 'failed' || isError) ? (
          <div className="rounded-xl border border-border bg-muted/40 p-4 text-left">
            <h3 className="font-semibold text-foreground">Need help?</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Click &ldquo;Check again&rdquo; to see if setup has finished.</li>
              <li>Your store creation is being processed — no need to resubmit it.</li>
              <li>Once setup finishes, your dashboard will open automatically.</li>
              <li>If things don&rsquo;t progress after a few attempts, reach out to our support team.</li>
            </ul>
          </div>
        ) : null}

      </div>
    </div>
  );
}
