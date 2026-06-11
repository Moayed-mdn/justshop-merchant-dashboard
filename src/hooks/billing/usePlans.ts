'use client';

/**
 * Hook for fetching available subscription plans.
 */

import { useQuery } from '@tanstack/react-query';
import { getPlans } from '@/lib/api/billing';
import { queryKeys } from '@/lib/queryKeys';
import { QUERY_CONFIG } from '@/config/query';
import type { Plan } from '@/types/billing/plan';
import type { ApiError } from '@/types/api';

export function usePlans() {
  return useQuery<Plan[], ApiError>({
    queryKey: queryKeys.billing.plans(),
    queryFn: getPlans,
    staleTime: QUERY_CONFIG.staleTime,
  });
}
