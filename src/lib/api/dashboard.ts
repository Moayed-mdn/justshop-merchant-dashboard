/**
 * Dashboard API functions for client-side use.
 * Uses apiClient (axios) for HTTP requests.
 * Never use these functions in RSC — use serverFetch instead.
 */

import { clientApi } from '@/lib/api/client';
import type { ApiResponse } from '@/types/api';
import { API_ROUTES } from '@/config/routes';
import type {
  DashboardStats,
  RecentOrderItem,
  TopProductItem,
} from '@/types/dashboard';

/**
 * Fetch dashboard stats for a store.
 * @param storeSlug - Store ID from URL params
 */
export async function getDashboardStats(storeSlug: string): Promise<DashboardStats> {
  const response = await clientApi.get<ApiResponse<DashboardStats>>(API_ROUTES.store(storeSlug).dashboard().stats());
  return response.data;
}

/**
 * Fetch recent orders for a store.
 * @param storeSlug - Store ID from URL params
 */
export async function getRecentOrders(storeSlug: string): Promise<RecentOrderItem[]> {
  const response = await clientApi.get<ApiResponse<RecentOrderItem[]>>(API_ROUTES.store(storeSlug).dashboard().recentOrders());
  return response.data;
}

/**
 * Fetch top products for a store.
 * @param storeSlug - Store ID from URL params
 */
export async function getTopProducts(storeSlug: string): Promise<TopProductItem[]> {
  const response = await clientApi.get<ApiResponse<TopProductItem[]>>(API_ROUTES.store(storeSlug).dashboard().topProducts());
  return response.data;
}
