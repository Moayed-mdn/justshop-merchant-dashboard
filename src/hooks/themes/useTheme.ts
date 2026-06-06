'use client';

/**
 * Hook for fetching a single theme detail.
 */

import { useQuery } from '@tanstack/react-query';
import { getThemeDetail } from '@/lib/api/themes';
import { queryKeys } from '@/lib/queryKeys';
import { QUERY_CONFIG } from '@/config/query';
import { mapTheme } from '@/lib/mappers/themes';
import type { Theme, ThemeView } from '@/types/theme';
import type { ApiError } from '@/types/api';

export function useTheme(storeId: string, themeId: string) {
  return useQuery<Theme, ApiError, ThemeView>({
    queryKey: queryKeys.themes(storeId).detail(themeId),
    queryFn: () => getThemeDetail(storeId, themeId),
    staleTime: QUERY_CONFIG.staleTime,
    select: mapTheme,
  });
}
