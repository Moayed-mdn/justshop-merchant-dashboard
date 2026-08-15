/**
 * Billing Page Client Component
 * Fetches and displays subscription data
 */

'use client';

import { useSubscription } from '@/hooks/billing/useSubscription';
import { useEntitlements } from '@/hooks/billing/useEntitlements';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { SubscriptionStatusCard, EntitlementUsageCard } from '@/components/billing';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Receipt, ExternalLink, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCreatePortalSession } from '@/hooks/billing/useCreatePortalSession';
import { formatCurrency } from '@/lib/billing/billing-utils';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';

export function BillingPageClient() {
  const t = useTranslations('billing');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const { data: subscriptionData, isLoading, error } = useSubscription();
  const { data: entitlement, isLoading: entitlementLoading } = useEntitlements(activeStore?.id?.toString() || '');
  const createPortal = useCreatePortalSession();
  const [waitingForWebhook, setWaitingForWebhook] = useState(false);

  // Extract subscription from response
  const subscription = subscriptionData?.subscription;

  // Check if we just came back from successful trial signup
  const trialSuccess = searchParams.get('trial') === 'success';

  // Show success message on first load after trial signup
  useEffect(() => {
    if (trialSuccess && !waitingForWebhook) {
      setWaitingForWebhook(true);
      toast({
        title: t('alerts.trialStarted'),
        description: t('alerts.trialActivating'),
      });
      
      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete('trial');
      window.history.replaceState({}, '', url.toString());
    }
  }, [trialSuccess, waitingForWebhook, toast]);

  // Reset waiting state once the subscription query settles without a subscription.
  // Prevents infinite spinner when navigating back from Stripe portal (bfcache) or
  // when the webhook hasn't created the subscription yet.
  useEffect(() => {
    if (!isLoading && waitingForWebhook) {
      if (subscription) {
        toast({
          title: t('alerts.subscriptionActive'),
          description: t('alerts.subscriptionActiveMessage'),
        });
      }
      setWaitingForWebhook(false);
    }
  }, [isLoading, waitingForWebhook, subscription, toast, t]);

  const noSubscription = !isLoading && !subscription && !waitingForWebhook;

  // Only redirect if we're sure there's no subscription and we're not waiting for webhook
  useEffect(() => {
    if (noSubscription && !trialSuccess) {
      // Don't redirect immediately to avoid race condition with webhook
      const timer = setTimeout(() => {
        router.replace('/merchant/billing/trial/start');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [noSubscription, trialSuccess, router]);

  // Show loading state while waiting for subscription after trial signup
  if (isLoading || (waitingForWebhook && !subscription)) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">
            {waitingForWebhook 
              ? t('activatingSubscription')
              : t('loading')}
          </p>
        </div>
      </div>
    );
  }

  // If we have an error and we're not coming from trial, redirect
  if (error && !trialSuccess && !waitingForWebhook) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('redirectingToTrial')}</p>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return null;
  }

  // Calculate real usage from entitlement data
  const currentStoreCount = entitlement?.limits?.['stores.count'] ?? 1;
  const currentProductCount = entitlement?.limits?.['products.count'] ?? 0;

  const handleOpenPortal = async () => {
    try {
      const { url } = await createPortal.mutateAsync(window.location.href);
      window.location.href = url;
    } catch (error) {
      console.error('Failed to open billing portal:', error);
    }
  };

  // Get current price
  const currentPrice = subscription.plan?.prices.find(
    (p) => p.billing_cycle === subscription.billing_cycle
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      {/* Subscription Status */}
      <section>
        <SubscriptionStatusCard subscription={subscription} onOpenPortal={handleOpenPortal} />
      </section>

      {/* Usage & Limits */}
      <section>
        {entitlementLoading ? (
          <Card>
            <CardHeader>
              <CardTitle>{t('usage.title')}</CardTitle>
              <CardDescription>{t('usage.loading')}</CardDescription>
            </CardHeader>
          </Card>
        ) : entitlement && entitlement.features ? (
          <EntitlementUsageCard
            entitlement={entitlement}
            currentStores={currentStoreCount}
            currentProducts={currentProductCount}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{t('usage.title')}</CardTitle>
              <CardDescription>{t('usage.errorLoading')}</CardDescription>
            </CardHeader>
          </Card>
        )}
      </section>

      {/* Billing & Payment */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>{t('payment.title')}</CardTitle>
            <CardDescription>{t('payment.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/merchant/billing/invoices" className="flex-1">
                <Button variant="outline" className="w-full">
                  <Receipt className="me-2 h-4 w-4" />
                  {t('payment.viewInvoices')}
                </Button>
              </Link>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleOpenPortal}
                disabled={createPortal.isPending}
              >
                <ExternalLink className="me-2 h-4 w-4" />
                {createPortal.isPending ? t('payment.opening') : t('payment.billingPortal')}
              </Button>
            </div>

            {currentPrice && subscription.current_period_ends_at && (
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{t('payment.nextInvoice')}</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(currentPrice.amount_cents, currentPrice.currency)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('payment.on')} {new Date(subscription.current_period_ends_at).toLocaleDateString()}
                    </p>
                  </div>
                  <CreditCard className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
