/**
 * Theme API functions (client-side).
 * All calls go through clientApi → /api/proxy → Laravel.
 */

import { clientApi } from '@/lib/api/client';
import { API_ROUTES } from '@/config/routes';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type {
  Theme,
  ThemeListItem,
  CreateThemePayload,
  UpdateThemePayload,
  DuplicateThemePayload,
  ThemeFilters,
} from '@/types/theme';

/**
 * Fetch paginated themes list.
 */
export async function getThemes(
  storeId: string,
  filters: ThemeFilters,
): Promise<PaginatedResponse<ThemeListItem>> {
  const params: Record<string, string | number> = {};

  if (filters.page !== 1) params.page = filters.page;
  if (filters.perPage !== 15) params.per_page = filters.perPage;
  if (filters.status && filters.status !== 'all') {
    params.status = filters.status;
  }

  return clientApi.get<PaginatedResponse<ThemeListItem>>(
    API_ROUTES.store(storeId).themes().list(),
    { params },
  );
}

/**
 * Fetch single theme by ID with full details.
 */
export async function getThemeDetail(
  storeId: string,
  themeId: string,
): Promise<Theme> {
  const response = await clientApi.get<ApiResponse<Theme>>(
    API_ROUTES.store(storeId).themes().detail(themeId),
  );
  return response.data;
}

/**
 * Create a new theme.
 */
export async function createTheme(
  storeId: string,
  payload: CreateThemePayload,
): Promise<Theme> {
  const response = await clientApi.post<ApiResponse<Theme>>(
    API_ROUTES.store(storeId).themes().create(),
    payload,
  );
  return response.data;
}

/**
 * Update an existing theme.
 */
export async function updateTheme(
  storeId: string,
  themeId: string,
  payload: UpdateThemePayload,
): Promise<Theme> {
  const response = await clientApi.put<ApiResponse<Theme>>(
    API_ROUTES.store(storeId).themes().update(themeId),
    payload,
  );
  return response.data;
}

/**
 * Delete a theme.
 */
export async function deleteTheme(
  storeId: string,
  themeId: string,
): Promise<void> {
  await clientApi.delete(API_ROUTES.store(storeId).themes().delete(themeId));
}

/**
 * Publish a theme (makes it active).
 */
export async function publishTheme(
  storeId: string,
  themeId: string,
): Promise<Theme> {
  const response = await clientApi.post<ApiResponse<Theme>>(
    API_ROUTES.store(storeId).themes().publish(themeId),
  );
  return response.data;
}

/**
 * Duplicate a theme with a new name.
 */
export async function duplicateTheme(
  storeId: string,
  themeId: string,
  payload: DuplicateThemePayload,
): Promise<Theme> {
  const response = await clientApi.post<ApiResponse<Theme>>(
    API_ROUTES.store(storeId).themes().duplicate(themeId),
    payload,
  );
  return response.data;
}
