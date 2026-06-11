/**
 * Cancel Subscription Dialog (Client Component)
 * Confirmation dialog for subscription cancellation
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
import { AlertTriangle } from 'lucide-react';
import { useCancelSubscription } from '@/hooks/billing/useCancelSubscription';
import { useState } from 'react';

interface CancelSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  periodEndDate?: string;
  onSuccess?: () => void;
}

export function CancelSubscriptionDialog({
  open,
  onOpenChange,
  periodEndDate,
  onSuccess,
}: CancelSubscriptionDialogProps) {
  const cancelMutation = useCancelSubscription();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCancel = async () => {
    try {
      setIsProcessing(true);
      await cancelMutation.mutateAsync();
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      // Error is handled by React Query
      console.error('Failed to cancel subscription:', error);
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
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/20">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <DialogTitle className="text-center">Cancel Subscription?</DialogTitle>
          <DialogDescription className="text-center">
            {periodEndDate ? (
              <>
                Your subscription will be canceled at the end of your current billing period on{' '}
                <strong>{formatDate(periodEndDate)}</strong>. You&apos;ll continue to have
                access until then.
              </>
            ) : (
              <>
                Your subscription will be canceled at the end of your current billing period.
                You&apos;ll continue to have access until then.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
          <p className="text-sm text-amber-900 dark:text-amber-100">
            <strong>Note:</strong> You can resume your subscription anytime before the end of your
            billing period.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Keep Subscription
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={isProcessing || cancelMutation.isPending}
          >
            {isProcessing || cancelMutation.isPending
              ? 'Canceling...'
              : 'Cancel Subscription'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
