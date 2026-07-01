'use client';

/**
 * Hook for creating a new merchant user.
 * Handles mutation, cache invalidation, and error notifications.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMerchantUser } from '@/lib/api/users';
import { queryKeys } from '@/lib/queryKeys';
import type { CreateMerchantUserPayload, UserDetail } from '@/types/user';
import type { ApiError } from '@/types/api';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

interface UseCreateUserOptions {
  onSuccess?: (user: UserDetail) => void;
  onError?: (error: ApiError) => void;
}

export function useCreateUser(storeSlug: string, options?: UseCreateUserOptions) {
  const queryClient = useQueryClient();
  const t = useTranslations('users');

  return useMutation<UserDetail, ApiError, CreateMerchantUserPayload>({
    mutationFn: (payload) => createMerchantUser(storeSlug, payload),
    onSuccess: (user) => {
      // Invalidate users list query to refresh table
      queryClient.invalidateQueries({
        queryKey: queryKeys.users(storeSlug).lists(),
      });

      toast.success(t('createSuccess'));
      options?.onSuccess?.(user);
    },
    onError: (error) => {
      // If it's a 403, it's handled by the API client usually, 
      // but we can show a specific message if needed.
      if (error.status === 403) {
        toast.error(t('errors.forbidden'));
      } else if (error.status !== 422) {
        // 422 errors are usually handled by the form itself
        toast.error(error.message || t('errors.createFailed'));
      }
      options?.onError?.(error);
    },
  });
}
