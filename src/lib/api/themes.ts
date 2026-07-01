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
  storeSlug: string,
  filters: ThemeFilters,
): Promise<PaginatedResponse<ThemeListItem>> {
  const params: Record<string, string | number> = {};

  if (filters.page !== 1) params.page = filters.page;
  if (filters.perPage !== 15) params.per_page = filters.perPage;
  if (filters.status && filters.status !== 'all') {
    params.status = filters.status;
  }

  return clientApi.get<PaginatedResponse<ThemeListItem>>(
    API_ROUTES.store(storeSlug).themes().list(),
    { params },
  );
}

/**
 * Fetch single theme by identifier with full details.
 */
export async function getThemeDetail(
  storeSlug: string,
  themeSlug: string,
): Promise<Theme> {
  const response = await clientApi.get<ApiResponse<Theme>>(
    API_ROUTES.store(storeSlug).themes().detail(themeSlug),
  );
  return response.data;
}

/**
 * Create a new theme.
 */
export async function createTheme(
  storeSlug: string,
  payload: CreateThemePayload,
): Promise<Theme> {
  const response = await clientApi.post<ApiResponse<Theme>>(
    API_ROUTES.store(storeSlug).themes().create(),
    payload,
  );
  return response.data;
}

/**
 * Update an existing theme.
 */
export async function updateTheme(
  storeSlug: string,
  themeSlug: string,
  payload: UpdateThemePayload,
): Promise<Theme> {
  const response = await clientApi.put<ApiResponse<Theme>>(
    API_ROUTES.store(storeSlug).themes().update(themeSlug),
    payload,
  );
  return response.data;
}

/**
 * Delete a theme.
 */
export async function deleteTheme(
  storeSlug: string,
  themeSlug: string,
): Promise<void> {
  await clientApi.delete(API_ROUTES.store(storeSlug).themes().delete(themeSlug));
}

/**
 * Publish a theme (makes it active).
 */
export async function publishTheme(
  storeSlug: string,
  themeSlug: string,
): Promise<Theme> {
  const response = await clientApi.post<ApiResponse<Theme>>(
    API_ROUTES.store(storeSlug).themes().publish(themeSlug),
  );
  return response.data;
}

/**
 * Duplicate a theme with a new name.
 */
export async function duplicateTheme(
  storeSlug: string,
  themeSlug: string,
  payload: DuplicateThemePayload,
): Promise<Theme> {
  const response = await clientApi.post<ApiResponse<Theme>>(
    API_ROUTES.store(storeSlug).themes().duplicate(themeSlug),
    payload,
  );
  return response.data;
}
