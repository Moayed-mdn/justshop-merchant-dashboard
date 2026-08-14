'use client';

/**
 * Hook for fetching current subscription.
 */

import { useQuery } from '@tanstack/react-query';
import { getSubscription } from '@/lib/api/billing';
import { queryKeys } from '@/lib/queryKeys';
import { QUERY_CONFIG } from '@/config/query';
import type { SubscriptionResponse } from '@/types/billing/subscription';
import type { ApiError } from '@/types/api';

export function useSubscription() {
  return useQuery<SubscriptionResponse, ApiError>({
    queryKey: queryKeys.billing.subscription(),
    queryFn: getSubscription,
    staleTime: QUERY_CONFIG.staleTime,
  });
}
