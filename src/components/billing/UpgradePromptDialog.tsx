/**
 * Upgrade Prompt Dialog (Client Component)
 * Modal shown when user hits quota limit
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
import { TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface UpgradePromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  limitType: 'stores' | 'products' | 'custom';
  currentPlan?: string;
  requiredPlan?: string;
  current?: number;
  limit?: number;
  message?: string;
}

export function UpgradePromptDialog({
  open,
  onOpenChange,
  limitType,
  currentPlan = 'Starter',
  requiredPlan = 'Growth',
  current,
  limit,
  message,
}: UpgradePromptDialogProps) {
  const getDefaultMessage = () => {
    if (limitType === 'stores') {
      return `You've reached your ${currentPlan} plan limit of ${limit} ${limit === 1 ? 'store' : 'stores'}. Upgrade to ${requiredPlan} to create more stores.`;
    }
    if (limitType === 'products') {
      return `You've reached your ${currentPlan} plan limit of ${limit?.toLocaleString()} products. Upgrade to ${requiredPlan} to add more products.`;
    }
    return message || 'Upgrade your plan to access this feature.';
  };

  const getLimitLabel = () => {
    if (limitType === 'stores') return 'Stores';
    if (limitType === 'products') return 'Products';
    return 'Limit';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/20">
            <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <DialogTitle className="text-center">Upgrade Required</DialogTitle>
          <DialogDescription className="text-center">{getDefaultMessage()}</DialogDescription>
        </DialogHeader>

        {current !== undefined && limit !== undefined && (
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{getLimitLabel()}</span>
              <span className="text-sm font-medium tabular-nums">
                {current} / {limit}
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-amber-500 transition-all"
                style={{ width: `${Math.min((current / limit) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Maybe Later
          </Button>
          <Link href="/merchant/billing/plans">
            <Button variant="default">
              <TrendingUp className="me-2 h-4 w-4" />
              View Plans
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
