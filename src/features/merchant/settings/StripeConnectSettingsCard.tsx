/**
 * Stripe Connect Settings Card
 * Displays store payout/onboarding status and lets the merchant
 * start or continue Stripe Connect onboarding.
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Landmark, ExternalLink, Clock, LayoutDashboard } from 'lucide-react';
import { useStripeConnectStatus } from '@/hooks/stripe-connect/useStripeConnectStatus';
import { useCreateStripeConnectOnboarding } from '@/hooks/stripe-connect/useCreateStripeConnectOnboarding';
import { useStripeDashboardLink } from '@/hooks/stripe-connect/useStripeDashboardLink';
import { formatApiErrorMessage } from '@/lib/api/error-message';
import type { ApiError } from '@/types/api';
import Link from 'next/link';
import { ROUTES } from '@/config/routes';
import { useTranslations } from 'next-intl';

interface StripeConnectSettingsCardProps {
  storeSlug: string;
}

export function StripeConnectSettingsCard({ storeSlug }: StripeConnectSettingsCardProps) {
  const t = useTranslations('settings.stripeConnectCard');
  const { data: status, isLoading } = useStripeConnectStatus(storeSlug);
  const createOnboarding = useCreateStripeConnectOnboarding(storeSlug);
  const openDashboard = useStripeDashboardLink(storeSlug);
  const [subscriptionRequired, setSubscriptionRequired] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  const handleConnect = async () => {
    setSubscriptionRequired(false);
    setErrorMessage(null);
    try {
      // Always request a fresh link right before redirecting — the URL
      // Stripe returns is single-use and expires in minutes.
      const { onboarding_url } = await createOnboarding.mutateAsync();
      window.location.href = onboarding_url;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError?.status === 403) {
        setSubscriptionRequired(true);
      } else {
        setErrorMessage(
          formatApiErrorMessage(apiError, { fallbackMessage: t('connectFailed') })
        );
      }
    }
  };

  const handleOpenDashboard = async () => {
    setDashboardError(null);
    try {
      // Same rule as onboarding: fresh link every click, never reused —
      // Stripe login links are single-use and expire quickly.
      const { url } = await openDashboard.mutateAsync();
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      setDashboardError(
        formatApiErrorMessage(error as ApiError, { fallbackMessage: t('dashboardLinkFailed') })
      );
    }
  };

  if (isLoading) {
    return (
      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Landmark className="h-5 w-5" />
            <CardTitle>{t('title')}</CardTitle>
          </div>
          <CardDescription>{t('loading')}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const canReceivePayments = status?.can_receive_payments ?? false;
  const hasAccount = !!status?.stripe_account_id;

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Landmark className="h-5 w-5" />
            <CardTitle>{t('title')}</CardTitle>
          </div>
          {hasAccount && (
            <Badge variant={canReceivePayments ? 'default' : 'secondary'}>
              {canReceivePayments ? t('statusActive') : t('statusIncomplete')}
            </Badge>
          )}
        </div>
        <CardDescription>{t('subtitle')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasAccount && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <p className="text-sm text-muted-foreground">{t('notConnected')}</p>
            <Button onClick={handleConnect} disabled={createOnboarding.isPending}>
              <ExternalLink className="me-2 h-4 w-4" />
              {createOnboarding.isPending ? t('connecting') : t('connectButton')}
            </Button>
          </div>
        )}

        {hasAccount && !canReceivePayments && (
          <div className="rounded-lg border p-4 space-y-3">
            <p className="text-sm text-muted-foreground">{t('incompleteMessage')}</p>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleConnect} disabled={createOnboarding.isPending} variant="outline">
                <ExternalLink className="me-2 h-4 w-4" />
                {createOnboarding.isPending ? t('connecting') : t('continueSetupButton')}
              </Button>
              {/* Express Dashboard works even mid-onboarding — it shows the
                  merchant exactly what's still outstanding, so this is a
                  valid alternate path, not just for fully-active accounts. */}
              <Button onClick={handleOpenDashboard} disabled={openDashboard.isPending} variant="ghost">
                <LayoutDashboard className="me-2 h-4 w-4" />
                {openDashboard.isPending ? t('openingDashboard') : t('viewDashboardButton')}
              </Button>
            </div>
          </div>
        )}

        {hasAccount && canReceivePayments && (
          <div className="rounded-lg border p-4 space-y-3">
            <p className="text-sm text-muted-foreground">{t('activeMessage')}</p>
            {!status?.payouts_enabled && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{t('payoutsPending')}</span>
              </div>
            )}
            <Button onClick={handleOpenDashboard} disabled={openDashboard.isPending}>
              <LayoutDashboard className="me-2 h-4 w-4" />
              {openDashboard.isPending ? t('openingDashboard') : t('viewDashboardButton')}
            </Button>
          </div>
        )}

        {dashboardError && (
          <p className="text-sm text-destructive">{dashboardError}</p>
        )}

        {subscriptionRequired && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 space-y-2">
            <p className="text-sm text-destructive">{t('subscriptionRequired')}</p>
            <Button asChild variant="outline" size="sm">
              <Link href={ROUTES.merchant.billing.dashboard()}>{t('goToBilling')}</Link>
            </Button>
          </div>
        )}

        {errorMessage && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}
      </CardContent>
    </Card>
  );
}
