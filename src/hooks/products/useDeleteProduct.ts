'use client';

/**
 * Hook for deleting a product.
 */

import { useMutation } from '@tanstack/react-query';
import { deleteProduct } from '@/lib/api/products';
import queryClient from '@/lib/queryClient';
import { queryKeys } from '@/lib/queryKeys';
import { logger } from '@/lib/logger';
import type { ApiError } from '@/types/api';

export interface UseDeleteProductOptions {
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
}

export function useDeleteProduct(
  storeSlug: string,
  productId: string,
  options?: UseDeleteProductOptions
) {
  return useMutation({
    mutationFn: () => deleteProduct(storeSlug, productId),
    retry: 0,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products(storeSlug).lists() });
      logger.info('Product deleted', { productId, storeSlug });
      options?.onSuccess?.();
    },
    onError: (error: ApiError) => {
      logger.error('Delete product failed', error);
      options?.onError?.(error);
    },
  });
}
