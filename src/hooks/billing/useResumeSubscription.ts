'use client';

/**
 * Hook for resuming a canceled subscription (before period end).
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resumeSubscription } from '@/lib/api/billing';
import { queryKeys } from '@/lib/queryKeys';
import type { Subscription } from '@/types/billing/subscription';
import type { ApiError } from '@/types/api';

export function useResumeSubscription() {
  const queryClient = useQueryClient();

  return useMutation<Subscription, ApiError, void>({
    mutationFn: resumeSubscription,
    onSuccess: () => {
      // Invalidate subscription query to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.billing.subscription() });
    },
  });
}
