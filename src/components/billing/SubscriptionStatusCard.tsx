/**
 * Subscription Status Card
 * Displays current subscription plan, status, renewal date, and actions
 */

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Calendar, TrendingUp, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { Subscription, SubscriptionStatus } from '@/types/billing/subscription';
import { useTranslations } from 'next-intl';

interface SubscriptionStatusCardProps {
  subscription: Subscription;
  onOpenPortal: () => void;
}

const STATUS_CONFIG: Record<
  SubscriptionStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  incomplete: { label: 'status.incomplete', variant: 'destructive' },
  trialing: { label: 'status.trialing', variant: 'default' },
  active: { label: 'status.active', variant: 'default' },
  past_due: { label: 'status.pastDue', variant: 'destructive' },
  grace_period: { label: 'status.gracePeriod', variant: 'destructive' },
  paused: { label: 'status.paused', variant: 'outline' },
  canceled: { label: 'status.canceled', variant: 'outline' },
  expired: { label: 'status.expired', variant: 'destructive' },
};

export function SubscriptionStatusCard({ subscription, onOpenPortal }: SubscriptionStatusCardProps) {
  const t = useTranslations('billing');
  const { locale } = useParams();
  const currentLocale = locale as 'en' | 'ar';
  const statusConfig = STATUS_CONFIG[subscription.status];
  const isTrialing = subscription.status === 'trialing';
  const isCanceled = subscription.cancel_at_period_end;
  const isPastDue = subscription.status === 'past_due';
  const hasPendingDowngrade = !!subscription.pending_plan_id;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {t('subscription.title')}
            </CardTitle>
            <CardDescription>{t('subscription.description')}</CardDescription>
          </div>
          <Badge variant={statusConfig.variant}>{t(statusConfig.label)}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Plan Info */}
        <div>
          <div className="text-sm text-muted-foreground">{t('subscription.plan')}</div>
          <div className="text-2xl font-semibold">
            {subscription.plan?.name?.[currentLocale] || subscription.plan?.name?.en || 'Unknown Plan'}
          </div>
          <div className="text-sm text-muted-foreground">
            {subscription.billing_cycle === 'annual' ? t('subscription.billedAnnually') : t('subscription.billedMonthly')}
          </div>
        </div>

        {/* Status Messages */}
        {hasPendingDowngrade && subscription.pending_plan && subscription.pending_plan_effective_at && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 rotate-180 text-amber-600 dark:text-amber-400" />
              <div className="flex-1">
                <div className="font-medium text-amber-900 dark:text-amber-100">
                  {t('alerts.downgradeScheduled')}
                </div>
                <div className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                  {t('alerts.downgradeMessage', {
                    currentPlan: subscription.plan?.name?.[currentLocale] || subscription.plan?.name?.en || 'current plan',
                    newPlan: subscription.pending_plan.name?.[currentLocale] || subscription.pending_plan.name?.en || 'new plan',
                    date: formatDate(subscription.pending_plan_effective_at)
                  })}
                </div>
                <div className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                  {t('alerts.keepAccessMessage', {
                    planName: subscription.plan?.name?.[currentLocale] || subscription.plan?.name?.en || 'your current plan'
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {isTrialing && subscription.trial_ends_at && (
          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <div className="font-medium text-blue-900 dark:text-blue-100">
                  {t('alerts.trialEnds', { date: formatDate(subscription.trial_ends_at) })}
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  {t('alerts.trialMessage')}
                </div>
              </div>
            </div>
          </div>
        )}

        {isCanceled && subscription.current_period_ends_at && (
          <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-950/20">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <div>
                <div className="font-medium text-amber-900 dark:text-amber-100">
                  {t('alerts.subscriptionCanceled')}
                </div>
                <div className="text-sm text-amber-700 dark:text-amber-300">
                  {t('alerts.accessUntil', { date: formatDate(subscription.current_period_ends_at) })}
                </div>
              </div>
            </div>
          </div>
        )}

        {isPastDue && subscription.grace_period_ends_at && (
          <div className="rounded-lg bg-red-50 p-4 dark:bg-red-950/20">
            <div className="flex items-start gap-3">
              <ExternalLink className="h-5 w-5 text-red-600 dark:text-red-400" />
              <div>
                <div className="font-medium text-red-900 dark:text-red-100">{t('alerts.paymentFailed')}</div>
                <div className="text-sm text-red-700 dark:text-red-300">
                  {t('alerts.updatePaymentBy', { date: formatDate(subscription.grace_period_ends_at) })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Renewal Date */}
        {!isCanceled && subscription.status === 'active' && subscription.current_period_ends_at && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{t('subscription.renewsOn')} {formatDate(subscription.current_period_ends_at)}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {hasPendingDowngrade ? (
            <>
              <Link href="/merchant/billing/plans">
                <Button variant="default">
                  <TrendingUp className="me-2 h-4 w-4" />
                  {t('subscription.changePlan')}
                </Button>
              </Link>
              <Button variant="outline" onClick={onOpenPortal}>
                <ExternalLink className="me-2 h-4 w-4" />
                {t('subscription.cancelDowngrade')}
              </Button>
            </>
          ) : !isCanceled ? (
            <>
              <Link href="/merchant/billing/plans">
                <Button variant="default">
                  <TrendingUp className="me-2 h-4 w-4" />
                  {t('subscription.changePlan')}
                </Button>
              </Link>
              <Button variant="outline" onClick={onOpenPortal}>
                <ExternalLink className="me-2 h-4 w-4" />
                {t('subscription.billingPortal')}
              </Button>
            </>
          ) : (
            <Link href="/merchant/billing/resume">
              <Button variant="default">{t('subscription.resumeSubscription')}</Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
