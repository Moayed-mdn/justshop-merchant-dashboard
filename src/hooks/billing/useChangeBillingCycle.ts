'use client';

/**
 * Hook for changing billing cycle (monthly ↔ annual).
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { changeBillingCycle } from '@/lib/api/billing';
import { queryKeys } from '@/lib/queryKeys';
import type { Subscription, ChangeBillingCyclePayload } from '@/types/billing/subscription';
import type { ApiError } from '@/types/api';

export function useChangeBillingCycle() {
  const queryClient = useQueryClient();

  return useMutation<Subscription, ApiError, ChangeBillingCyclePayload>({
    mutationFn: changeBillingCycle,
    onSuccess: () => {
      // Invalidate subscription query to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.billing.subscription() });
      queryClient.invalidateQueries({ queryKey: queryKeys.billing.invoices() });
    },
  });
}
