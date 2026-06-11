'use client';

/**
 * Hook for upgrading subscription to a higher-tier plan.
 * Upgrade is immediate and prorated.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { upgradeSubscription } from '@/lib/api/billing';
import { queryKeys } from '@/lib/queryKeys';
import type { Subscription, UpgradeSubscriptionPayload } from '@/types/billing/subscription';
import type { ApiError } from '@/types/api';

export function useUpgradeSubscription() {
  const queryClient = useQueryClient();

  return useMutation<Subscription, ApiError, UpgradeSubscriptionPayload>({
    mutationFn: upgradeSubscription,
    onSuccess: () => {
      // Invalidate subscription query to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.billing.subscription() });
      queryClient.invalidateQueries({ queryKey: queryKeys.billing.invoices() });
    },
  });
}
