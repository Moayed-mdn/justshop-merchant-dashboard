'use client';

/**
 * Hook for creating a new category.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@/lib/navigation';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { createCategory } from '@/lib/api/categories';
import { queryKeys } from '@/lib/queryKeys';
import { ROUTES } from '@/config/routes';
import { logger } from '@/lib/logger';
import type { CreateCategoryPayload } from '@/types/category';
import type { ApiError } from '@/types/api';

export function useCreateCategory(storeSlug: string) {
  const queryClient = useQueryClient();
  const router      = useRouter();
  const t           = useTranslations('categories');

  return useMutation<unknown, ApiError, CreateCategoryPayload>({
    mutationFn: (payload) => createCategory(storeSlug, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories(storeSlug).lists(),
      });
      toast.success(t('form.createSuccess'));
      router.push(ROUTES.merchant.categories.list());
    },

    onError: (error) => {
      logger.error('Failed to create category', error);
      toast.error(error.message ?? t('form.createError'));
    },
  });
}
