'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { useRouter } from '@/lib/navigation';
import { toast } from 'sonner';
import type { ApiError } from '@/types/api';
import { ROUTES } from '@/config/routes';
import { normalizeBackendRedirectPath, resolveBootstrapAccessState } from '@/lib/auth/bootstrap-routing';
import { postAuthChannelMessage } from '@/lib/auth/channel';

export function useSwitchStore() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const switchStore = useBootstrapStore((state) => state.switchStore);

  return useMutation({
    mutationKey: ['store-switch'],
    mutationFn: (storeId: number | string) => switchStore(storeId),
    onMutate: async () => {
      await queryClient.cancelQueries({
        predicate: (query) =>
          query.queryKey[0] !== 'bootstrap' && query.queryKey[0] !== 'store-switch',
      });
    },
    onSuccess: async (bootstrap) => {
      if (!bootstrap) {
        router.push(ROUTES.dashboard.home());
        return;
      }

      queryClient.setQueryData(queryKeys.auth.me(), bootstrap);
      queryClient.removeQueries({
        queryKey: ['provisioning-status'],
      });
      await queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] !== 'bootstrap' &&
          query.queryKey[0] !== 'provisioning-status' &&
          query.queryKey[0] !== 'store-switch',
      });

      postAuthChannelMessage('active-store-changed', {
        activeStoreId: bootstrap.active_store_id,
      });
      toast.success('Store switched successfully');

      router.push(resolveBootstrapAccessState(bootstrap).redirectPath);
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to switch store');
      if (error.code === 'STORE_ACCESS_DENIED') {
        void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
        router.push(normalizeBackendRedirectPath(error.redirect) ?? ROUTES.dashboard.home());
      }
    },
  });
}
