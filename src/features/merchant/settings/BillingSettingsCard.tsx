/**
 * Billing Settings Card
 * Displays subscription information in settings page
 */

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, ExternalLink, ArrowRight } from 'lucide-react';
import { useSubscription } from '@/hooks/billing/useSubscription';
import { useCreatePortalSession } from '@/hooks/billing/useCreatePortalSession';
import { formatCurrency } from '@/lib/billing/billing-utils';
import Link from 'next/link';
import { ROUTES } from '@/config/routes';

export function BillingSettingsCard() {
  const { data: subscription, isLoading } = useSubscription();
  const createPortal = useCreatePortalSession();

  const handleOpenPortal = async () => {
    try {
      const { url } = await createPortal.mutateAsync(window.location.href);
      window.location.href = url;
    } catch (error) {
      console.error('Failed to open billing portal:', error);
    }
  };

  if (isLoading) {
    return (
      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <CardTitle>Subscription & Billing</CardTitle>
          </div>
          <CardDescription>Loading subscription information...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <CardTitle>Subscription & Billing</CardTitle>
          </div>
          <CardDescription>
            Manage your subscription plan and billing information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <p className="text-sm text-muted-foreground">
              You don't have an active subscription
            </p>
            <Button asChild>
              <Link href={ROUTES.merchant.billing.trial.start()}>
                Start Free Trial
                <ArrowRight className="ms-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentPrice = subscription.plan?.prices.find(
    (p) => p.billing_cycle === subscription.billing_cycle
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'trialing':
        return 'secondary';
      case 'past_due':
        return 'destructive';
      case 'canceled':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <CardTitle>Subscription & Billing</CardTitle>
          </div>
          <Badge variant={getStatusVariant(subscription.status)}>
            {subscription.plan?.name || subscription.status}
          </Badge>
        </div>
        <CardDescription>
          Manage your subscription plan and billing information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Plan Info */}
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <p className="text-sm font-medium">Current Plan</p>
            <p className="text-2xl font-bold">{subscription.plan?.name || 'Unknown'}</p>
            <p className="text-sm capitalize text-muted-foreground">
              Billed {subscription.billing_cycle}ly
            </p>
          </div>
          {currentPrice && subscription.current_period_ends_at && (
            <div className="text-end">
              <p className="text-sm text-muted-foreground">
                {subscription.status === 'trialing' ? 'Trial ends' : 'Renews'}
              </p>
              <p className="text-sm font-medium">
                {new Date(
                  subscription.status === 'trialing' && subscription.trial_ends_at
                    ? subscription.trial_ends_at
                    : subscription.current_period_ends_at
                ).toLocaleDateString()}
              </p>
              {subscription.status !== 'trialing' && (
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(currentPrice.amount_cents, currentPrice.currency)}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild variant="default" className="flex-1">
            <Link href={ROUTES.merchant.billing.dashboard()}>
              Manage Subscription
              <ArrowRight className="ms-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href={ROUTES.merchant.billing.plans()}>View Plans</Link>
          </Button>
          <Button
            variant="outline"
            onClick={handleOpenPortal}
            disabled={createPortal.isPending}
          >
            <ExternalLink className="me-2 h-4 w-4" />
            {createPortal.isPending ? 'Opening...' : 'Billing Portal'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
