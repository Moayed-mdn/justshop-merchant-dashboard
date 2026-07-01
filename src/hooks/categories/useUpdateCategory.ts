'use client';

/**
 * Hook for updating an existing category.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { updateCategory } from '@/lib/api/categories';
import { queryKeys } from '@/lib/queryKeys';
import { logger } from '@/lib/logger';
import type { UpdateCategoryPayload } from '@/types/category';
import type { ApiError } from '@/types/api';

export function useUpdateCategory(storeSlug: string, categoryId: string) {
  const queryClient = useQueryClient();
  const t           = useTranslations('categories');

  return useMutation<unknown, ApiError, UpdateCategoryPayload>({
    mutationFn: (payload) => updateCategory(storeSlug, categoryId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories(storeSlug).lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories(storeSlug).detail(categoryId),
      });
      toast.success(t('form.updateSuccess'));
    },

    onError: (error) => {
      logger.error('Failed to update category', error);
      toast.error(error.message ?? t('form.updateError'));
    },
  });
}
