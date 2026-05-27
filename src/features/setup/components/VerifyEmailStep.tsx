'use client';

import { Button } from '@/components/ui/button';
import { Link } from '@/lib/navigation';
import { ROUTES } from '@/config/routes';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { MailCheck } from 'lucide-react';

export function VerifyEmailStep() {
  const queryClient = useQueryClient();

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

        <div className="flex flex-col gap-3">
          <Button
            type="button"
            onClick={() => void queryClient.invalidateQueries({ queryKey: queryKeys.merchant.me() })}
          >
            I have verified my email
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
