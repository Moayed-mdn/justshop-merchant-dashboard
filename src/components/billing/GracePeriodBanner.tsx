/**
 * Grace Period Banner (Client Component for dismiss)
 * Urgent warning during payment failure grace period
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X } from 'lucide-react';

interface GracePeriodBannerProps {
  gracePeriodEndsAt: string;
  onUpdatePayment: () => void;
}

export function GracePeriodBanner({
  gracePeriodEndsAt,
  onUpdatePayment,
}: GracePeriodBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return null;
  }

  const daysRemaining = Math.ceil(
    (new Date(gracePeriodEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/50 dark:bg-red-950/20">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
        <span className="text-sm text-red-900 dark:text-red-100">
          <strong>Payment Failed:</strong> Your payment failed. You have{' '}
          <strong>
            {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
          </strong>{' '}
          to update your payment method before your account is suspended (
          {formatDate(gracePeriodEndsAt)}).
        </span>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button size="sm" variant="default" onClick={onUpdatePayment}>
          Update Payment
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsDismissed(true)}
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
