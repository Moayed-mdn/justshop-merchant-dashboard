'use client';

/**
 * Hook for fetching platform dashboard stats.
 */

import { useQuery } from '@tanstack/react-query';
import { getPlatformDashboardStats } from '@/lib/api/platform/dashboard';
import { queryKeys } from '@/lib/queryKeys';
import { QUERY_CONFIG } from '@/config/query';
import type { PlatformDashboardStats } from '@/types/platform-dashboard';
import type { ApiError } from '@/types/api';

export function usePlatformDashboard() {
  return useQuery<PlatformDashboardStats, ApiError>({
    queryKey: queryKeys.platform.dashboard(),
    queryFn: () => getPlatformDashboardStats(),
    staleTime: QUERY_CONFIG.staleTime,
  });
}
