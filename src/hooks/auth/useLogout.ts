'use client';

/**
 * Mutation hook for logout.
 * 
 * Hard rules followed:
 * - No useRouter import (navigation in component layer only)
 * - No toast import (toast in component layer only)
 * - retry: 0 (mutations never retry)
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { logger } from '@/lib/logger';
import type { ApiError } from '@/types/api';
import { postAuthChannelMessage } from '@/lib/auth/channel';
import { queryKeys } from '@/lib/queryKeys';
import { clearDashboardClientStorage } from '@/lib/auth/storage';

export interface UseLogoutOptions {
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
}

/**
 * Hook to handle user logout.
 * Clears auth state and query cache on success.
 */
export function useLogout(options?: UseLogoutOptions) {
  const logout = useBootstrapStore((state) => state.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        await logout();
      } catch (error) {
        const apiError = error as ApiError;
        if (apiError.status === 401) {
          return;
        }

        throw apiError;
      }
    },
    retry: 0,
    onSuccess: async () => {
      await queryClient.cancelQueries();
      clearDashboardClientStorage();
      queryClient.clear();
      queryClient.setQueryData(queryKeys.auth.me(), null);
      
      // Notify other tabs
      postAuthChannelMessage('logout');

      logger.info('User logged out');
      options?.onSuccess?.();
    },
    onError: (error: ApiError) => {
      logger.error('Logout failed', { error });
      options?.onError?.(error);
    },
  });
}
