/**
 * Downgrade Confirm Dialog (Client Component)
 * Confirmation dialog for plan downgrade
 */

'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingDown } from 'lucide-react';
import { useDowngradeSubscription } from '@/hooks/billing/useDowngradeSubscription';
import { useState } from 'react';
import type { BillingCycle } from '@/types/billing/plan';

interface DowngradeConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: string;
  targetPlan: string;
  targetPlanCode: string;
  billingCycle: BillingCycle;
  periodEndDate?: string;
  onSuccess?: () => void;
}

export function DowngradeConfirmDialog({
  open,
  onOpenChange,
  currentPlan,
  targetPlan,
  targetPlanCode,
  billingCycle,
  periodEndDate,
  onSuccess,
}: DowngradeConfirmDialogProps) {
  const downgradeMutation = useDowngradeSubscription();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDowngrade = async () => {
    try {
      setIsProcessing(true);
      await downgradeMutation.mutateAsync({
        plan_code: targetPlanCode,
        billing_cycle: billingCycle,
        apply_immediately: false,
      });
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      // Error is handled by React Query
      console.error('Failed to downgrade subscription:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/20">
            <TrendingDown className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <DialogTitle className="text-center">Confirm Downgrade</DialogTitle>
          <DialogDescription className="text-center">
            You&apos;re about to downgrade from <strong>{currentPlan}</strong> to{' '}
            <strong>{targetPlan}</strong>.
            {periodEndDate && (
              <>
                {' '}
                The change will take effect on <strong>{formatDate(periodEndDate)}</strong>.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                  What happens when you downgrade:
                </p>
                <ul className="list-inside list-disc space-y-1 text-sm text-amber-700 dark:text-amber-300">
                  <li>Reduced storage and feature limits</li>
                  <li>Access to fewer premium features</li>
                  <li>Lower priority support</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> You&apos;ll keep full access to your current plan until{' '}
              {periodEndDate ? formatDate(periodEndDate) : 'the end of your billing period'}.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleDowngrade}
            disabled={isProcessing || downgradeMutation.isPending}
          >
            {isProcessing || downgradeMutation.isPending
              ? 'Processing...'
              : `Downgrade to ${targetPlan}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
