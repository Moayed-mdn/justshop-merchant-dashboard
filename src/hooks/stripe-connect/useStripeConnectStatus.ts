'use client';

/**
 * Hook for fetching a store's Stripe Connect account status.
 */

import { useQuery } from '@tanstack/react-query';
import { getStripeConnectStatus } from '@/lib/api/stripe-connect';
import { queryKeys } from '@/lib/queryKeys';
import { QUERY_CONFIG } from '@/config/query';
import type { StripeConnectStatus } from '@/types/stripe-connect';
import type { ApiError } from '@/types/api';

export function useStripeConnectStatus(storeSlug: string | undefined) {
  return useQuery<StripeConnectStatus, ApiError>({
    queryKey: queryKeys.stripeConnect(storeSlug ?? '').status(),
    queryFn: () => getStripeConnectStatus(storeSlug as string),
    enabled: !!storeSlug,
    staleTime: QUERY_CONFIG.staleTime,
  });
}
