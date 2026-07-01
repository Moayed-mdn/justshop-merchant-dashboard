'use client';

/**
 * Hook for fetching a single theme detail.
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getThemeDetail } from '@/lib/api/themes';
import { queryKeys } from '@/lib/queryKeys';
import { QUERY_CONFIG } from '@/config/query';
import { mapTheme } from '@/lib/mappers/themes';
import type { Theme, ThemeView } from '@/types/theme';
import type { ApiError } from '@/types/api';

export function useTheme(
  storeSlug: string,
  themeSlug: string,
  options?: Omit<UseQueryOptions<Theme, ApiError, ThemeView>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Theme, ApiError, ThemeView>({
    queryKey: queryKeys.themes(storeSlug).detail(themeSlug),
    queryFn: () => getThemeDetail(storeSlug, themeSlug),
    staleTime: QUERY_CONFIG.staleTime,
    select: (theme) => mapTheme(theme, storeSlug),
    ...options,
  });
}
