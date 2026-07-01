'use client';

/**
 * Hook for asset mutations (upload, update, delete).
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadAsset, updateAsset, deleteAsset } from '@/lib/api/assets';
import { queryKeys } from '@/lib/queryKeys';
import type {
  UploadAssetPayload,
  UpdateAssetPayload,
  StoreAsset,
} from '@/types/asset';
import type { ApiError } from '@/types/api';

/**
 * Upload asset mutation.
 */
export function useUploadAsset(storeSlug: string) {
  const queryClient = useQueryClient();

  return useMutation<StoreAsset, ApiError, UploadAssetPayload>({
    mutationFn: (payload) => uploadAsset(storeSlug, payload),
    onSuccess: () => {
      // Invalidate all asset lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.assets(storeSlug).lists(),
      });
    },
  });
}

/**
 * Update asset mutation.
 */
export function useUpdateAsset(storeSlug: string) {
  const queryClient = useQueryClient();

  return useMutation<
    StoreAsset,
    ApiError,
    { assetId: string; payload: UpdateAssetPayload }
  >({
    mutationFn: ({ assetId, payload }) =>
      updateAsset(storeSlug, assetId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.assets(storeSlug).lists(),
      });
    },
  });
}

/**
 * Delete asset mutation.
 */
export function useDeleteAsset(storeSlug: string) {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: (assetId) => deleteAsset(storeSlug, assetId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.assets(storeSlug).lists(),
      });
    },
  });
}
