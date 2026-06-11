'use client';

/**
 * Hook for canceling subscription.
 * Cancellation takes effect at period end (merchant retains access).
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelSubscription } from '@/lib/api/billing';
import { queryKeys } from '@/lib/queryKeys';
import type { Subscription } from '@/types/billing/subscription';
import type { ApiError } from '@/types/api';

export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation<Subscription, ApiError, void>({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      // Invalidate subscription query to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.billing.subscription() });
    },
  });
}
