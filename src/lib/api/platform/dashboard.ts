/**
 * Platform Dashboard API functions (client-side).
 */

import { clientApi } from '@/lib/api/client';
import type { ApiResponse } from '@/types/api';
import { API_ROUTES } from '@/config/routes';
import type { PlatformDashboardStats } from '@/types/platform-dashboard';

/**
 * Get platform dashboard stats.
 */
export async function getPlatformDashboardStats(): Promise<PlatformDashboardStats> {
  const response = await clientApi.get<ApiResponse<PlatformDashboardStats>>(
    API_ROUTES.platform.dashboard()
  );
  return response.data;
}
