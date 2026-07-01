/**
 * Orders API functions (client-side).
 */

import { clientApi } from '@/lib/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import { API_ROUTES } from '@/config/routes';
import type { AdminOrder, OrderUpdatePayload } from '@/types/order';
import type { OrderFilters } from '@/schemas/orders';

/**
 * Get orders list with filters.
 */
export async function getOrders(
  storeSlug: string,
  filters: OrderFilters
): Promise<PaginatedResponse<AdminOrder>> {
  const params: Record<string, string | number> = {};

  if (filters.search && filters.search !== '') {
    params.search = filters.search;
  }
  if (filters.status !== 'all') {
    params.status = filters.status;
  }
  if (filters.payment_status !== 'all') {
    params.payment_status = filters.payment_status;
  }
  if (filters.page !== 1) {
    params.page = filters.page;
  }
  if (filters.perPage !== 10) {
    params.per_page = filters.perPage;
  }

  
  return clientApi.get<PaginatedResponse<AdminOrder>>(API_ROUTES.store(storeSlug).orders().list(), { params });
}

/**
 * Get order detail by ID.
 */
export async function getOrderDetail(
  storeSlug: string,
  orderId: string
): Promise<AdminOrder> {
  const response = await clientApi.get<ApiResponse<AdminOrder>>(API_ROUTES.store(storeSlug).orders().detail(orderId));
  return response.data;
}

/**
 * Update order status.
 */
export async function updateOrderStatus(
  storeSlug: string,
  orderId: string,
  payload: OrderUpdatePayload
): Promise<AdminOrder> {
  const response = await clientApi.patch<ApiResponse<AdminOrder>>(API_ROUTES.store(storeSlug).orders().updateStatus(orderId), payload);
  return response.data;
}
