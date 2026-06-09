'use client';

import { useBootstrapStore } from '@/stores/bootstrapStore';
import { needsProvisioningFlow } from '@/lib/auth/bootstrap-routing';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { Button } from '@/components/ui/button';
import { Link } from '@/lib/navigation';
import { ROUTES } from '@/config/routes';
import { VerifyEmailStep } from './VerifyEmailStep';
import { CreateStoreStep } from './CreateStoreStep';
import { ProvisioningStep } from './ProvisioningStep';
import { SetupCompleteStep } from './SetupCompleteStep';

/**
 * SetupOrchestrator
 *
 * Single state-machine component for the /setup route.
 * Renders the correct step based on bootstrap state — no route transitions.
 *
 * State machine:
 *   pending_verification → VerifyEmailStep
 *   create_store         → CreateStoreStep
 *   provisioning         → ProvisioningStep
 *   (bootstrap loading)  → Loading / recovery screen
 */
export function SetupOrchestrator() {
  const queryClient = useQueryClient();
  const bootstrap = useBootstrapStore((state) => state.bootstrap);
  const onboarding = useBootstrapStore((state) => state.onboarding);
  const provisioning = useBootstrapStore((state) => state.provisioning);

  // Healing: if email is verified but step is stuck at pending_verification, advance it
  const isEmailVerified = bootstrap?.email_verified || bootstrap?.user?.is_email_verified;
  const effectiveStep =
    onboarding?.step === 'pending_verification' && isEmailVerified
      ? 'create_store'
      : onboarding?.step;

  // Bootstrap not yet resolved
  if (!bootstrap || !onboarding) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
        <div className="w-full max-w-md rounded-xl border bg-card p-8 text-center shadow-sm">
          <div className="flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
          <h1 className="mt-4 text-2xl font-bold">Let&apos;s get your store ready</h1>
          <p className="mt-3 text-muted-foreground">
            We&apos;re picking up where you left off.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button
              type="button"
              onClick={() =>
                void queryClient.invalidateQueries({ queryKey: queryKeys.merchant.me() })
              }
            >
              Retry
            </Button>
            <Link
              href={ROUTES.auth.login()}
              className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Step: provisioning is actively tracked — always show ProvisioningStep immediately,
  // regardless of what onboarding.step says. This is the key transition point after
  // CreateStoreStep calls setProvisioning() — the backend step may still say
  // 'create_store' until fetchBootstrap is called by the polling loop.
  if (provisioning?.tracked_store_id && provisioning?.status !== null) {
    return <ProvisioningStep />;
  }

  // Step: email verification required
  if (effectiveStep === 'pending_verification') {
    return <VerifyEmailStep />;
  }

  // Step: create first store
  if (effectiveStep === 'create_store') {
    return <CreateStoreStep onSuccess={() => { /* setProvisioning in CreateStoreStep triggers re-render */ }} />;
  }

  // Step: provisioning in progress (bootstrap-driven, e.g. on page refresh)
  if (needsProvisioningFlow(bootstrap, provisioning)) {
    return <ProvisioningStep />;
  }

  // Fallback: bootstrap resolved and onboarding complete.
  // Show the completion handoff with first-action guidance.
  // BootstrapProvider will redirect to merchant routes as needed,
  // but this gives the merchant a moment to orient and choose their next step.
  return <SetupCompleteStep />;
}
