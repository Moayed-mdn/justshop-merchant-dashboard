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
import type { Subscription, SubscriptionStatus } from '@/types/billing/subscription';

interface SubscriptionStatusCardProps {
  subscription: Subscription;
  onOpenPortal: () => void;
}

const STATUS_CONFIG: Record<
  SubscriptionStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  incomplete: { label: 'Incomplete', variant: 'destructive' },
  trialing: { label: 'Free Trial', variant: 'default' },
  active: { label: 'Active', variant: 'default' },
  past_due: { label: 'Payment Failed', variant: 'destructive' },
  grace_period: { label: 'Grace Period', variant: 'destructive' },
  paused: { label: 'Paused', variant: 'outline' },
  canceled: { label: 'Canceled', variant: 'outline' },
  expired: { label: 'Expired', variant: 'destructive' },
};

export function SubscriptionStatusCard({ subscription, onOpenPortal }: SubscriptionStatusCardProps) {
  const statusConfig = STATUS_CONFIG[subscription.status];
  const isTrialing = subscription.status === 'trialing';
  const isCanceled = subscription.cancel_at_period_end;
  const isPastDue = subscription.status === 'past_due';

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
              Current Subscription
            </CardTitle>
            <CardDescription>Manage your subscription and billing</CardDescription>
          </div>
          <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Plan Info */}
        <div>
          <div className="text-sm text-muted-foreground">Plan</div>
          <div className="text-2xl font-semibold">
            {subscription.plan?.name.en || 'Unknown Plan'}
          </div>
          <div className="text-sm text-muted-foreground">
            {subscription.billing_cycle === 'annual' ? 'Billed Annually' : 'Billed Monthly'}
          </div>
        </div>

        {/* Status Messages */}
        {isTrialing && subscription.trial_ends_at && (
          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <div className="font-medium text-blue-900 dark:text-blue-100">
                  Trial Ends {formatDate(subscription.trial_ends_at)}
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  Choose a plan to continue after your trial ends
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
                  Subscription Canceled
                </div>
                <div className="text-sm text-amber-700 dark:text-amber-300">
                  Access until {formatDate(subscription.current_period_ends_at)}
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
                <div className="font-medium text-red-900 dark:text-red-100">Payment Failed</div>
                <div className="text-sm text-red-700 dark:text-red-300">
                  Update payment by {formatDate(subscription.grace_period_ends_at)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Renewal Date */}
        {!isCanceled && subscription.status === 'active' && subscription.current_period_ends_at && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Renews on {formatDate(subscription.current_period_ends_at)}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {!isCanceled && (
            <>
              <Link href="/merchant/billing/plans">
                <Button variant="default">
                  <TrendingUp className="me-2 h-4 w-4" />
                  Upgrade Plan
                </Button>
              </Link>
              <Button variant="outline" onClick={onOpenPortal}>
                <ExternalLink className="me-2 h-4 w-4" />
                Billing Portal
              </Button>
            </>
          )}

          {isCanceled && (
            <Link href="/merchant/billing/resume">
              <Button variant="default">Resume Subscription</Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
