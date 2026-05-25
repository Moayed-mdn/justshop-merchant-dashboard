'use client';

import { useEffect } from 'react';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { ProvisioningScreen } from './ProvisioningScreen';
import { ROUTES } from '@/config/routes';
import { Link } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';

const debugLog = (event: string, data: any = {}) => {
  if (typeof window === 'undefined') return;
  fetch('http://127.0.0.1:9999/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, data, timestamp: Date.now(), source: 'OnboardingPageContent' })
  }).catch(() => {});
};

export function OnboardingPageContent() {
  const queryClient = useQueryClient();
  const bootstrap = useBootstrapStore((state) => state.bootstrap);
  const onboarding = useBootstrapStore((state) => state.onboarding);
  const provisioning = useBootstrapStore((state) => state.provisioning);

  useEffect(() => {
    debugLog('OnboardingPageContent_Mount', { 
      step: onboarding?.step, 
      hasBootstrap: !!bootstrap,
      trackedStoreId: provisioning?.tracked_store_id
    });
    return () => debugLog('OnboardingPageContent_Unmount');
  }, []);

  // Safety: If the store hasn't "healed" the step yet, but we see the email is verified,
  // we should treat it as the create_store step.
  const isEmailVerified = bootstrap?.email_verified || bootstrap?.user?.is_email_verified;
  const effectiveStep = (onboarding?.step === 'pending_verification' && isEmailVerified)
    ? 'create_store'
    : onboarding?.step;

  if (!bootstrap || !onboarding) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
        <div className="w-full max-w-xl rounded-xl border bg-card p-8 text-center shadow-sm">
          <h1 className="text-3xl font-bold">Restoring onboarding state</h1>
          <p className="mt-3 text-muted-foreground">
            The app is recovering your merchant onboarding step from the canonical bootstrap payload.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button
              type="button"
              onClick={() => void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() })}
            >
              Retry bootstrap
            </Button>
            <Link href={ROUTES.auth.login()} className="text-sm font-medium text-primary hover:underline">
              Go to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (effectiveStep === 'pending_verification') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
        <div className="w-full max-w-xl rounded-xl border bg-card p-8 text-center shadow-sm">
          <h1 className="text-3xl font-bold">Verify your email</h1>
          <p className="mt-3 text-muted-foreground">
            Your account is authenticated, but dashboard access stays locked until email verification is complete.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            After verifying your email, return here and refresh the dashboard session.
          </p>
          <div className="mt-4 rounded-lg border border-border bg-muted/40 p-4 text-start text-sm text-muted-foreground">
            <p className="font-medium text-foreground">What happens next</p>
            <p className="mt-2">
              Bootstrap will restore this step after refresh or browser reopen. Once verification is complete, the app will move you into first-store creation automatically.
            </p>
          </div>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button type="button" onClick={() => void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() })}>
              I have verified my email
            </Button>
            <Link href={ROUTES.auth.login()} className="text-sm font-medium text-primary hover:underline">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (effectiveStep === 'create_store') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
        <div className="w-full max-w-2xl space-y-10 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight">Welcome to your dashboard</h1>
            <p className="text-xl text-muted-foreground">
              Create your first store to unlock the dashboard, permissions, and active store context.
            </p>
            <p className="text-sm text-muted-foreground">
              This step is refresh-safe. If you leave and come back later, bootstrap will restore you here until store creation begins.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border bg-card p-6 text-left shadow-sm">
              <div className="mb-2 font-semibold">1. Create store</div>
              <p className="text-sm text-muted-foreground">Choose a store name and slug that match your tenant identity.</p>
            </div>
            <div className="rounded-xl border bg-card p-6 text-left shadow-sm">
              <div className="mb-2 font-semibold">2. Provision store</div>
              <p className="text-sm text-muted-foreground">The backend prepares the first store asynchronously after creation succeeds.</p>
            </div>
            <div className="rounded-xl border bg-card p-6 text-left shadow-sm">
              <div className="mb-2 font-semibold">3. Open dashboard</div>
              <p className="text-sm text-muted-foreground">Bootstrap unlocks the dashboard only after the active store is operational.</p>
            </div>
          </div>

          <div>
            <Link
              href={ROUTES.onboarding.createStore()}
              className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-lg font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Create your first store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-3xl space-y-4 rounded-xl border bg-card p-6 shadow-sm">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold">Finishing store setup</h1>
          <p className="text-sm text-muted-foreground">
            Store creation has started. This screen restores automatically after refresh until bootstrap confirms the store is ready.
          </p>
          {provisioning?.tracked_store_id ? (
            <p className="text-xs text-muted-foreground">
              Tracking provisioning for store #{provisioning.tracked_store_id}
            </p>
          ) : null}
        </div>
        <ProvisioningScreen />
      </div>
    </div>
  );
}
