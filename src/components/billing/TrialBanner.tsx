/**
 * Trial Banner (Client Component for dismiss)
 * Countdown banner during free trial period
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, X } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface TrialBannerProps {
  trialEndsAt: string;
}

export function TrialBanner({ trialEndsAt }: TrialBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return null;
  }

  const daysRemaining = Math.ceil(
    (new Date(trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const getVariant = () => {
    if (daysRemaining <= 3) return 'destructive';
    if (daysRemaining <= 7) return 'warning';
    return 'default';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const variant = getVariant();

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 rounded-lg border px-4 py-3',
        variant === 'destructive' &&
          'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20',
        variant === 'warning' &&
          'border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20',
        variant === 'default' &&
          'border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/20'
      )}
    >
      <div className="flex items-center gap-3">
        <Clock
          className={cn(
            'h-4 w-4',
            variant === 'destructive' && 'text-red-600 dark:text-red-400',
            variant === 'warning' && 'text-amber-600 dark:text-amber-400',
            variant === 'default' && 'text-blue-600 dark:text-blue-400'
          )}
        />
        <span
          className={cn(
            'text-sm',
            variant === 'destructive' && 'text-red-900 dark:text-red-100',
            variant === 'warning' && 'text-amber-900 dark:text-amber-100',
            variant === 'default' && 'text-blue-900 dark:text-blue-100'
          )}
        >
          <strong>
            {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining
          </strong>{' '}
          in your free trial. Choose a plan to continue after {formatDate(trialEndsAt)}.
        </span>
      </div>
      <div className="flex shrink-0 gap-2">
        <Link href="/merchant/billing/plans">
          <Button size="sm" variant="default">
            Choose a Plan
          </Button>
        </Link>
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
