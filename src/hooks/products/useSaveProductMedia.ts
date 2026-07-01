'use client';

import { useMutation } from '@tanstack/react-query';

import { updateProduct }     from '@/lib/api/products';
import queryClient           from '@/lib/queryClient';
import { queryKeys }         from '@/lib/queryKeys';
import { logger }            from '@/lib/logger';
import { buildMediaPayload } from '@/features/products/editor/payloads/buildMediaPayload';

import type { AdminProduct }    from '@/types/product';
import type { ApiError }        from '@/types/api';
import type { ProductMediaState } from '@/features/products/editor/types/product-editor';

export interface UseSaveProductMediaOptions {
  onSuccess?: (product: AdminProduct) => void;
  onError?:   (error: ApiError)      => void;
}

export function useSaveProductMedia(
  storeSlug:   string,
  productId: string,
  options?:  UseSaveProductMediaOptions
) {
  return useMutation<AdminProduct, ApiError, ProductMediaState>({
    mutationFn: (media: ProductMediaState) =>
      updateProduct(storeSlug, productId, buildMediaPayload({ media })),
    retry: 0,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products(storeSlug).lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.products(storeSlug).detail(productId),
      });
      logger.info('Product media saved', { productId: data.id });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      logger.error('Save product media failed', error);
      options?.onError?.(error);
    },
  });
}
