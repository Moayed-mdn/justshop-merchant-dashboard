'use client';

/**
 * Hook for fetching a single brand by ID.
 */

import { useQuery } from '@tanstack/react-query';
import { getBrandDetail } from '@/lib/api/brands';
import { queryKeys } from '@/lib/queryKeys';
import { QUERY_CONFIG } from '@/config/query';
import { mapBrandDetail } from '@/lib/mappers/brands';
import type { BrandDetail, BrandDetailView } from '@/types/brand';
import type { ApiError } from '@/types/api';

export function useBrandDetail(storeSlug: string, brandId: string) {
  return useQuery<BrandDetail, ApiError, BrandDetailView>({
    queryKey:  queryKeys.brands(storeSlug).detail(brandId),
    queryFn:   () => getBrandDetail(storeSlug, brandId),
    staleTime: QUERY_CONFIG.staleTime,
    select:    (brand) => mapBrandDetail(brand, storeSlug),
    enabled:   Boolean(storeSlug) && Boolean(brandId),
  });
}
