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
export function useUploadAsset(storeId: string) {
  const queryClient = useQueryClient();

  return useMutation<StoreAsset, ApiError, UploadAssetPayload>({
    mutationFn: (payload) => uploadAsset(storeId, payload),
    onSuccess: () => {
      // Invalidate all asset lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.assets(storeId).lists(),
      });
    },
  });
}

/**
 * Update asset mutation.
 */
export function useUpdateAsset(storeId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    StoreAsset,
    ApiError,
    { assetId: string; payload: UpdateAssetPayload }
  >({
    mutationFn: ({ assetId, payload }) =>
      updateAsset(storeId, assetId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.assets(storeId).lists(),
      });
    },
  });
}

/**
 * Delete asset mutation.
 */
export function useDeleteAsset(storeId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: (assetId) => deleteAsset(storeId, assetId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.assets(storeId).lists(),
      });
    },
  });
}
