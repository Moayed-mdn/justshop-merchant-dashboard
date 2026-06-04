'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from '@/lib/navigation';
import { ROUTES } from '@/config/routes';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { MailCheck, Loader2, AlertCircle } from 'lucide-react';
import { checkEmailVerificationStatus, resendVerificationEmail } from '@/lib/api/auth';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import type { ApiError } from '@/types/api';

export function VerifyEmailStep() {
  const queryClient = useQueryClient();
  const fetchBootstrap = useBootstrapStore((state) => state.fetchBootstrap);

  const [isChecking, setIsChecking] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  async function handleCheckVerification() {
    setErrorMessage(null);
    setResendMessage(null);
    setIsChecking(true);

    try {
      // Call the dedicated status endpoint — the backend returns a 422 if not verified yet.
      await checkEmailVerificationStatus();

      // Verified: refresh bootstrap and let SetupOrchestrator advance to create_store.
      const bootstrap = await fetchBootstrap();
      queryClient.setQueryData(queryKeys.merchant.me(), bootstrap);
      await queryClient.invalidateQueries({ queryKey: queryKeys.merchant.me() });
    } catch (err) {
      const apiError = err as ApiError;
      setErrorMessage(
        apiError?.message ??
          "Your email hasn't been verified yet. Please check your inbox and click the verification link."
      );
    } finally {
      setIsChecking(false);
    }
  }

  async function handleResend() {
    setErrorMessage(null);
    setResendMessage(null);
    setIsResending(true);

    try {
      const res = await resendVerificationEmail();
      setResendMessage(res.message ?? 'Verification email sent. Check your inbox.');
    } catch (err) {
      const apiError = err as ApiError;
      setErrorMessage(apiError?.message ?? 'Failed to resend the verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-md space-y-6 rounded-xl border bg-card p-8 text-center shadow-sm">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <MailCheck className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Check your inbox</h1>
          <p className="text-muted-foreground">
            We sent a verification link to your email address. Click it to unlock your merchant dashboard.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-muted/40 p-4 text-left text-sm text-muted-foreground">
          <p className="font-medium text-foreground">What happens next</p>
          <p className="mt-2">
            After verifying your email, come back here and click the button below. The setup will continue automatically.
          </p>
        </div>

        {/* Error feedback */}
        {errorMessage ? (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-3 text-left text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        ) : null}

        {/* Resend success feedback */}
        {resendMessage ? (
          <div className="rounded-lg border border-border/70 bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
            {resendMessage}
          </div>
        ) : null}

        <div className="flex flex-col gap-3">
          <Button
            type="button"
            onClick={() => void handleCheckVerification()}
            disabled={isChecking || isResending}
          >
            {isChecking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking…
              </>
            ) : (
              'I have verified my email'
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => void handleResend()}
            disabled={isChecking || isResending}
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending…
              </>
            ) : (
              'Resend verification email'
            )}
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
