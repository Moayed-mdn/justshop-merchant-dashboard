'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { updateStore } from '@/lib/api/stores';
import { toast } from 'sonner';
import type { ApiError, ApiResponse } from '@/types/api';
import type { Store, UpdateStorePayload } from '@/types/store';

/**
 * Hook to update a store's settings.
 * Refreshes both the specific store detail and the global bootstrap state on success.
 */
export function useUpdateStore(storeId: string) {
  const queryClient = useQueryClient();
  const fetchBootstrap = useBootstrapStore((state) => state.fetchBootstrap);

  return useMutation<ApiResponse<Store>, ApiError, UpdateStorePayload>({
    mutationFn: (payload: UpdateStorePayload) => updateStore(storeId, payload),
    onSuccess: async (response) => {
      // 1. Invalidate the store detail in the query cache
      await queryClient.invalidateQueries({
        queryKey: queryKeys.merchant.store(storeId).detail(),
      });

      // 2. Refresh global bootstrap state to sync the store name in switcher/sidebar
      try {
        await fetchBootstrap();
      } catch (error) {
        console.error('[useUpdateStore] Failed to refresh bootstrap after store update', error);
      }

      toast.success('Store updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update store');
    },
  });
}
