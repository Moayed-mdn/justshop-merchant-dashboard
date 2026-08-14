/**
 * Platform Subscriptions API functions (client-side).
 */

import { clientApi } from '@/lib/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import { API_ROUTES } from '@/config/routes';
import type { 
  SubscriptionListItem, 
  SubscriptionDetail, 
  SubscriptionFilters 
} from '@/types/billing/subscription';

/**
 * Get subscriptions list with filters.
 */
export async function getSubscriptions(
  filters: SubscriptionFilters
): Promise<PaginatedResponse<SubscriptionListItem>> {
  const params: Record<string, string | number> = {};

  if (filters.search && filters.search !== '') params.search = filters.search;
  if (filters.status !== 'all') params.status = filters.status;
  if (filters.plan_id !== null) params.plan_id = filters.plan_id;
  if (filters.sort !== 'created_at') params.sort = filters.sort;
  if (filters.order !== 'desc') params.order = filters.order;
  if (filters.page !== 1) params.page = filters.page;
  if (filters.perPage !== 25) params.per_page = filters.perPage;

  return clientApi.get<PaginatedResponse<SubscriptionListItem>>(
    API_ROUTES.platform.billing.subscriptions.list(),
    { params }
  );
}

/**
 * Get subscription detail by ID.
 */
export async function getSubscriptionDetail(id: number): Promise<SubscriptionDetail> {
  const response = await clientApi.get<ApiResponse<SubscriptionDetail>>(
    API_ROUTES.platform.billing.subscriptions.detail(id)
  );
  return response.data;
}

/**
 * Get plans list for filter dropdown.
 */
export async function getPlans(): Promise<Array<{ id: number; code: string; name: string }>> {
  const response = await clientApi.get<ApiResponse<Array<{ id: number; code: string; name: string }>>>(
    API_ROUTES.platform.billing.plans.list()
  );
  return response.data;
}
