'use client';

import { useCallback } from 'react';
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

  // Called by CreateStoreStep after successful store creation.
  // Bootstrap state will have been updated by then, so the orchestrator
  // will re-render into the provisioning step automatically.
  const handleStoreCreated = useCallback(() => {
    // No-op: state update in CreateStoreStep triggers re-render here.
    // Kept as an explicit callback for future extensibility (e.g. analytics).
  }, []);

  // Bootstrap not yet resolved
  if (!bootstrap || !onboarding) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
        <div className="w-full max-w-md rounded-xl border bg-card p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold">Restoring your setup</h1>
          <p className="mt-3 text-muted-foreground">
            Recovering your merchant setup state from the server.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button
              type="button"
              onClick={() =>
                void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() })
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

  // Step: email verification required
  if (effectiveStep === 'pending_verification') {
    return <VerifyEmailStep />;
  }

  // Step: create first store
  if (effectiveStep === 'create_store') {
    return <CreateStoreStep onSuccess={handleStoreCreated} />;
  }

  // Step: provisioning in progress (or any other in-progress backend step)
  if (needsProvisioningFlow(bootstrap, provisioning)) {
    return <ProvisioningStep />;
  }

  // Fallback: bootstrap resolved but step is unrecognised — show recovery
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-md rounded-xl border bg-card p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold">Setup complete</h1>
        <p className="mt-3 text-muted-foreground">
          Your store setup is complete. Redirecting you to the dashboard.
        </p>
        <div className="mt-6">
          <Button
            type="button"
            onClick={() =>
              void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() })
            }
          >
            Go to dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
