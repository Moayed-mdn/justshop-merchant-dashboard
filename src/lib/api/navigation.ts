/**
 * Navigation Menu API functions (client-side).
 * All calls go through clientApi → /api/proxy → Laravel.
 */

import { clientApi } from '@/lib/api/client';
import { API_ROUTES } from '@/config/routes';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type {
  NavigationMenuListItem,
  NavigationMenuDetail,
  NavigationMenuItem,
  CreateNavigationMenuPayload,
  UpdateNavigationMenuPayload,
  CreateMenuItemPayload,
  UpdateMenuItemPayload,
  ReorderMenuItemsPayload,
  NavigationMenuFilters,
} from '@/types/navigation';

type NavigationMenusListResponse =
  | PaginatedResponse<NavigationMenuListItem>
  | ApiResponse<NavigationMenuListItem[]>
  | ApiResponse<PaginatedResponse<NavigationMenuListItem>>;

function isPaginatedNavigationMenusResponse(
  response: NavigationMenusListResponse,
): response is PaginatedResponse<NavigationMenuListItem> {
  return Array.isArray(response.data) && Boolean(response.meta?.pagination);
}

function normalizeNavigationMenusResponse(
  response: NavigationMenusListResponse,
  filters: NavigationMenuFilters,
): PaginatedResponse<NavigationMenuListItem> {
  if (isPaginatedNavigationMenusResponse(response)) {
    return response;
  }

  if (Array.isArray(response.data)) {
    return {
      success: response.success,
      status: response.status,
      message: response.message,
      data: response.data,
      meta: {
        pagination: {
          total: response.data.length,
          count: response.data.length,
          per_page: filters.perPage,
          current_page: filters.page,
          total_pages: 1,
        },
      },
    };
  }

  if (Array.isArray(response.data?.data)) {
    return {
      success: response.success,
      status: response.status,
      message: response.message,
      data: response.data.data,
      meta: {
        pagination: response.data.meta?.pagination ?? {
          total: response.data.data.length,
          count: response.data.data.length,
          per_page: filters.perPage,
          current_page: filters.page,
          total_pages: 1,
        },
      },
    };
  }

  throw new Error('Unexpected navigation menus response shape');
}

/**
 * Fetch paginated navigation menus list.
 */
export async function getNavigationMenus(
  storeId: string,
  filters: NavigationMenuFilters,
): Promise<PaginatedResponse<NavigationMenuListItem>> {
  const params: Record<string, string | number> = {};

  if (filters.page !== 1) params.page = filters.page;
  if (filters.perPage !== 15) params.per_page = filters.perPage;

  const response = await clientApi.get<NavigationMenusListResponse>(
    API_ROUTES.store(storeId).navigation().list(),
    { params },
  );

  return normalizeNavigationMenusResponse(response, filters);
}

/**
 * Fetch single navigation menu by ID with all items.
 */
export async function getNavigationMenuDetail(
  storeId: string,
  menuId: string,
): Promise<NavigationMenuDetail> {
  const response = await clientApi.get<ApiResponse<NavigationMenuDetail>>(
    API_ROUTES.store(storeId).navigation().detail(menuId),
  );
  return response.data;
}

/**
 * Create a new navigation menu.
 */
export async function createNavigationMenu(
  storeId: string,
  payload: CreateNavigationMenuPayload,
): Promise<NavigationMenuDetail> {
  const response = await clientApi.post<ApiResponse<NavigationMenuDetail>>(
    API_ROUTES.store(storeId).navigation().create(),
    payload,
  );
  return response.data;
}

/**
 * Update an existing navigation menu.
 */
export async function updateNavigationMenu(
  storeId: string,
  menuId: string,
  payload: UpdateNavigationMenuPayload,
): Promise<NavigationMenuDetail> {
  const response = await clientApi.put<ApiResponse<NavigationMenuDetail>>(
    API_ROUTES.store(storeId).navigation().update(menuId),
    payload,
  );
  return response.data;
}

/**
 * Delete a navigation menu.
 */
export async function deleteNavigationMenu(
  storeId: string,
  menuId: string,
): Promise<void> {
  await clientApi.delete(
    API_ROUTES.store(storeId).navigation().delete(menuId),
  );
}

/**
 * Create a new menu item.
 */
export async function createMenuItem(
  storeId: string,
  menuId: string,
  payload: CreateMenuItemPayload,
): Promise<NavigationMenuItem> {
  const response = await clientApi.post<ApiResponse<NavigationMenuItem>>(
    API_ROUTES.store(storeId).navigation().items(menuId).create(),
    payload,
  );
  return response.data;
}

/**
 * Update an existing menu item.
 */
export async function updateMenuItem(
  storeId: string,
  menuId: string,
  itemId: string,
  payload: UpdateMenuItemPayload,
): Promise<NavigationMenuItem> {
  const response = await clientApi.put<ApiResponse<NavigationMenuItem>>(
    API_ROUTES.store(storeId).navigation().items(menuId).update(itemId),
    payload,
  );
  return response.data;
}

/**
 * Delete a menu item.
 */
export async function deleteMenuItem(
  storeId: string,
  menuId: string,
  itemId: string,
): Promise<void> {
  await clientApi.delete(
    API_ROUTES.store(storeId).navigation().items(menuId).delete(itemId),
  );
}

/**
 * Reorder menu items (including parent changes for nesting).
 */
export async function reorderMenuItems(
  storeId: string,
  menuId: string,
  payload: ReorderMenuItemsPayload,
): Promise<void> {
  await clientApi.post(
    API_ROUTES.store(storeId).navigation().items(menuId).reorder(),
    payload,
  );
}

/**
 * Fetch available pages for linking in navigation.
 */
export async function getNavigationResourcePages(
  storeId: string,
  search?: string,
): Promise<any[]> {
  const params = search ? { search } : {};
  const response = await clientApi.get<ApiResponse<any[]>>(
    `/api/v1/merchant/stores/${storeId}/theme/navigation/resources/pages`,
    { params },
  );
  return response.data;
}

/**
 * Fetch available categories for linking in navigation.
 */
export async function getNavigationResourceCategories(
  storeId: string,
  search?: string,
): Promise<any[]> {
  const params = search ? { search } : {};
  const response = await clientApi.get<ApiResponse<any[]>>(
    `/api/v1/merchant/stores/${storeId}/theme/navigation/resources/categories`,
    { params },
  );
  return response.data;
}

/**
 * Fetch available products for linking in navigation.
 */
export async function getNavigationResourceProducts(
  storeId: string,
  search?: string,
): Promise<any[]> {
  const params = search ? { search } : {};
  const response = await clientApi.get<ApiResponse<any[]>>(
    `/api/v1/merchant/stores/${storeId}/theme/navigation/resources/products`,
    { params },
  );
  return response.data;
}

/**
 * Validate if a URL/page exists.
 */
export async function validateNavigationUrl(
  storeId: string,
  url: string,
): Promise<{ exists: boolean; suggestion?: string }> {
  try {
    const response = await clientApi.post<ApiResponse<{ exists: boolean; suggestion?: string }>>(
      `/api/v1/merchant/stores/${storeId}/navigation/validate-url`,
      { url },
    );
    return response.data;
  } catch {
    return { exists: false };
  }
}
