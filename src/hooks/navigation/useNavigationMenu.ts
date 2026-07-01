'use client';

/**
 * Hook for fetching single navigation menu detail with all items.
 */

import { useQuery } from '@tanstack/react-query';
import { getNavigationMenuDetail } from '@/lib/api/navigation';
import { queryKeys } from '@/lib/queryKeys';
import { QUERY_CONFIG } from '@/config/query';
import { mapNavigationMenuDetail } from '@/lib/mappers/navigation';
import type {
  NavigationMenuDetail,
  NavigationMenuDetailView,
} from '@/types/navigation';
import type { ApiError } from '@/types/api';

export function useNavigationMenu(storeSlug: string, menuId: string) {
  return useQuery<NavigationMenuDetail, ApiError, NavigationMenuDetailView>({
    queryKey: queryKeys.navigation(storeSlug).detail(menuId),
    queryFn: () => getNavigationMenuDetail(storeSlug, menuId),
    staleTime: QUERY_CONFIG.staleTime,
    select: (menu) => mapNavigationMenuDetail(menu, storeSlug),
  });
}
