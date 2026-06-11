'use client';

/**
 * Hook for fetching store entitlements.
 */

import { useQuery } from '@tanstack/react-query';
import { getStoreEntitlements } from '@/lib/api/billing';
import { queryKeys } from '@/lib/queryKeys';
import { QUERY_CONFIG } from '@/config/query';
import type { StoreEntitlement } from '@/types/billing/entitlement';
import type { ApiError } from '@/types/api';

export function useEntitlements(storeId: string) {
  return useQuery<StoreEntitlement, ApiError>({
    queryKey: queryKeys.billing.entitlements(storeId),
    queryFn: () => getStoreEntitlements(storeId),
    staleTime: QUERY_CONFIG.staleTime,
    enabled: !!storeId,
  });
}
