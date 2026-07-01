'use client';

/**
 * Hook for fetching a single category by ID.
 */

import { useQuery } from '@tanstack/react-query';
import { getCategoryDetail } from '@/lib/api/categories';
import { queryKeys } from '@/lib/queryKeys';
import { QUERY_CONFIG } from '@/config/query';
import { mapCategoryDetail } from '@/lib/mappers/categories';
import type { CategoryDetail, CategoryDetailView } from '@/types/category';
import type { ApiError } from '@/types/api';

export function useCategoryDetail(storeSlug: string, categoryId: string) {
  return useQuery<CategoryDetail, ApiError, CategoryDetailView>({
    queryKey: queryKeys.categories(storeSlug).detail(categoryId),
    queryFn:  () => getCategoryDetail(storeSlug, categoryId),
    staleTime: QUERY_CONFIG.staleTime,
    select:    (category) => mapCategoryDetail(category, storeSlug),
    enabled:   Boolean(storeSlug) && Boolean(categoryId),
  });
}
