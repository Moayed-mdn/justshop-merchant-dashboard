'use client';

/**
 * Hook for fetching paginated navigation menus list.
 */

import { useQuery } from '@tanstack/react-query';
import { getNavigationMenus } from '@/lib/api/navigation';
import { queryKeys } from '@/lib/queryKeys';
import { QUERY_CONFIG } from '@/config/query';
import { mapNavigationMenuListItem } from '@/lib/mappers/navigation';
import { selectPaginatedList } from '@/lib/mappers/pagination';
import type {
  NavigationMenuListItem,
  NavigationMenuListItemView,
  NavigationMenuFilters,
} from '@/types/navigation';
import type { PaginatedResponse, ApiError } from '@/types/api';

const DEFAULT_FILTERS: NavigationMenuFilters = {
  page: 1,
  perPage: 15,
};

export function useNavigationMenus(
  storeSlug: string,
  filters: NavigationMenuFilters = DEFAULT_FILTERS,
) {
  return useQuery<
    PaginatedResponse<NavigationMenuListItem>,
    ApiError,
    PaginatedResponse<NavigationMenuListItemView>
  >({
    queryKey: queryKeys.navigation(storeSlug).list(
      filters as unknown as Record<string, unknown>,
    ),
    queryFn: () => getNavigationMenus(storeSlug, filters),
    staleTime: QUERY_CONFIG.staleTime,
    select: selectPaginatedList((menu) => mapNavigationMenuListItem(menu, storeSlug)),
  });
}
