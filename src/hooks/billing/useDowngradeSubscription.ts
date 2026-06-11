'use client';

/**
 * Hook for downgrading subscription to a lower-tier plan.
 * Downgrade is scheduled at period end by default.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { downgradeSubscription } from '@/lib/api/billing';
import { queryKeys } from '@/lib/queryKeys';
import type { Subscription, DowngradeSubscriptionPayload } from '@/types/billing/subscription';
import type { ApiError } from '@/types/api';

export function useDowngradeSubscription() {
  const queryClient = useQueryClient();

  return useMutation<Subscription, ApiError, DowngradeSubscriptionPayload>({
    mutationFn: downgradeSubscription,
    onSuccess: () => {
      // Invalidate subscription query to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.billing.subscription() });
    },
  });
}
