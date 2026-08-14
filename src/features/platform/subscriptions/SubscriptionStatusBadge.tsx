/**
 * Subscription status badge component.
 * Color-coded badges for subscription statuses.
 */

import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import type { SubscriptionStatus } from '@/types/billing/subscription';

interface Props {
  status: SubscriptionStatus;
}

export function SubscriptionStatusBadge({ status }: Props) {
  const t = useTranslations('subscriptions.status');

  const variants: Record<SubscriptionStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    incomplete: 'outline',
    trialing: 'secondary',
    active: 'default',
    past_due: 'destructive',
    grace_period: 'destructive',
    paused: 'secondary',
    canceled: 'secondary',
    expired: 'outline',
  };

  return (
    <Badge variant={variants[status]}>
      {t(status)}
    </Badge>
  );
}
