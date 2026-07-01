'use client';

/**
 * Hook for fetching product detail.
 */

import { useQuery } from '@tanstack/react-query';
import { getProductDetail } from '@/lib/api/products';
import { queryKeys } from '@/lib/queryKeys';
import { QUERY_CONFIG } from '@/config/query';
import type { AdminProduct, ProductDetailView } from '@/types/product';
import type { ApiResponse, ApiError } from '@/types/api';
import { mapProductDetail } from '@/lib/mappers/products';

export function useProductDetail(storeSlug: string, productId: string) {
  return useQuery<AdminProduct, ApiError, ProductDetailView>({
    queryKey: queryKeys.products(storeSlug).detail(productId),
    queryFn: () => getProductDetail(storeSlug, productId),
    staleTime: QUERY_CONFIG.staleTime,
    select: (data) => mapProductDetail(data, storeSlug),
  });
}
