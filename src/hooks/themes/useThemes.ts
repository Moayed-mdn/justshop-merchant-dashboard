'use client';

/**
 * Hook for fetching paginated themes list.
 */

import { useQuery } from '@tanstack/react-query';
import { getThemes } from '@/lib/api/themes';
import { queryKeys } from '@/lib/queryKeys';
import { QUERY_CONFIG } from '@/config/query';
import { mapThemeListItem } from '@/lib/mappers/themes';
import { selectPaginatedList } from '@/lib/mappers/pagination';
import type {
  ThemeListItem,
  ThemeListItemView,
  ThemeFilters,
} from '@/types/theme';
import type { PaginatedResponse, ApiError } from '@/types/api';

const DEFAULT_FILTERS: ThemeFilters = {
  page: 1,
  perPage: 15,
};

export function useThemes(
  storeId: string,
  filters: ThemeFilters = DEFAULT_FILTERS,
) {
  return useQuery<
    PaginatedResponse<ThemeListItem>,
    ApiError,
    PaginatedResponse<ThemeListItemView>
  >({
    queryKey: queryKeys.themes(storeId).list(
      filters as unknown as Record<string, unknown>,
    ),
    queryFn: () => getThemes(storeId, filters),
    staleTime: QUERY_CONFIG.staleTime,
    select: selectPaginatedList(mapThemeListItem),
  });
}
