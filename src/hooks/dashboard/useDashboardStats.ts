'use client';

/**
 * Hook for fetching dashboard stats.
 * Uses TanStack Query with automatic mapping to view shape.
 */

import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '@/lib/api/dashboard';
import { queryKeys } from '@/lib/queryKeys';
import { QUERY_CONFIG } from '@/config/query';
import { mapDashboardStats } from '@/lib/mappers/dashboard';
import type { DashboardStatsView, DashboardStats } from '@/types/dashboard';
import { useStoreStore, selectCurrentStoreCurrency } from '@/stores/storeStore';

/**
 * Fetch dashboard stats for a store.
 * @param storeSlug - Store ID from URL params
 */
export function useDashboardStats(storeSlug: string) {
  // TODO: storeStore currency defaults to 'USD' until store settings
  // endpoint is available. StoreInitializer will populate this later.
  const currency = useStoreStore(selectCurrentStoreCurrency);

  return useQuery<DashboardStats, Error, DashboardStatsView>({
    queryKey: queryKeys.dashboard(storeSlug).stats(),
    queryFn: () => getDashboardStats(storeSlug),
    staleTime: QUERY_CONFIG.staleTime,
    select: (data) => mapDashboardStats(data, currency),
  });
}
