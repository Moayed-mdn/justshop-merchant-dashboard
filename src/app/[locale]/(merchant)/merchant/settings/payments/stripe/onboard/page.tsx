/**
 * Stripe Connect Onboarding — Refresh Page
 * Stripe redirects the merchant here if their onboarding link expired or
 * another pass is needed before the account is fully set up. This is not a
 * page the merchant lingers on — it silently requests a fresh onboarding
 * URL and immediately continues the redirect to Stripe.
 *
 * IMPORTANT: this exact path is hardcoded on the backend as the Stripe
 * AccountLink refresh_url (see OnboardMerchantToStripeAction on
 * laratenant-backend) and receives no store identifier or query params from
 * Stripe — store context comes from bootstrapStore, not the URL.
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { useCreateStripeConnectOnboarding } from '@/hooks/stripe-connect/useCreateStripeConnectOnboarding';
import { WorkspaceEmptyState } from '@/features/merchant/components/WorkspaceEmptyState';
import { formatApiErrorMessage } from '@/lib/api/error-message';
import { ROUTES } from '@/config/routes';
import type { ApiError } from '@/types/api';

export default function StripeConnectOnboardRefreshPage() {
  const t = useTranslations('settings.stripeConnectReturn');
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const storeSlug = activeStore?.slug;

  const createOnboarding = useCreateStripeConnectOnboarding(storeSlug);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const attemptedRef = useRef(false);

  useEffect(() => {
    if (!storeSlug || attemptedRef.current) return;
    attemptedRef.current = true;

    createOnboarding
      .mutateAsync()
      .then(({ onboarding_url }) => {
        window.location.href = onboarding_url;
      })
      .catch((error: ApiError) => {
        setErrorMessage(
          formatApiErrorMessage(error, { fallbackMessage: t('refreshFailed') })
        );
      });
    // Intentionally run once per mount only — re-running on every
    // createOnboarding identity change would loop the redirect attempt.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeSlug]);

  if (!storeSlug) {
    return (
      <div className="container mx-auto px-4 py-16">
        <WorkspaceEmptyState />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-md">
          <div className="rounded-lg border bg-card p-8 text-center">
            <XCircle className="mx-auto h-16 w-16 text-destructive" />
            <h1 className="mt-4 text-2xl font-bold">{t('refreshFailedTitle')}</h1>
            <p className="mt-2 text-muted-foreground">{errorMessage}</p>
            <Button asChild className="mt-6">
              <Link href={ROUTES.merchant.settings()}>{t('goToSettings')}</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-md">
        <div className="rounded-lg border bg-card p-8 text-center">
          <Loader2 className="mx-auto h-16 w-16 animate-spin text-primary" />
          <h1 className="mt-4 text-2xl font-bold">{t('redirectingTitle')}</h1>
          <p className="mt-2 text-muted-foreground">{t('redirectingMessage')}</p>
        </div>
      </div>
    </div>
  );
}
