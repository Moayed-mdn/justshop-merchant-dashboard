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

  return clientApi.get<PaginatedResponse<NavigationMenuListItem>>(
    API_ROUTES.store(storeId).navigation().list(),
    { params },
  );
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
  const response = await clientApi.patch<ApiResponse<NavigationMenuDetail>>(
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
  const response = await clientApi.patch<ApiResponse<NavigationMenuItem>>(
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
