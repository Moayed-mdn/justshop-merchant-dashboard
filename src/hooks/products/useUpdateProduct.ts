'use client';

/**
 * Hook for updating an existing product.
 */

import { useMutation } from '@tanstack/react-query';
import { updateProduct } from '@/lib/api/products';
import queryClient from '@/lib/queryClient';
import { queryKeys } from '@/lib/queryKeys';
import { logger } from '@/lib/logger';
import type { AdminProduct, ProductUpdatePayload } from '@/types/product';
import type { ApiError } from '@/types/api';

export interface UseUpdateProductOptions {
  onSuccess?: (product: AdminProduct) => void;
  onError?: (error: ApiError) => void;
}

export function useUpdateProduct(
  storeSlug: string,
  productId: string,
  options?: UseUpdateProductOptions
) {
  return useMutation({
    mutationFn: (payload: ProductUpdatePayload) => updateProduct(storeSlug, productId, payload),
    retry: 0,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products(storeSlug).lists() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.products(storeSlug).detail(productId),
      });
      logger.info('Product updated', { productId: data.id });
      options?.onSuccess?.(data);
    },
    onError: (error: ApiError) => {
      logger.error('Update product failed', error);
      options?.onError?.(error);
    },
  });
}
