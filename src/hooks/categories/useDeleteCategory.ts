'use client';

/**
 * Hook for soft-deleting a category.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@/lib/navigation';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { deleteCategory } from '@/lib/api/categories';
import { queryKeys } from '@/lib/queryKeys';
import { ROUTES } from '@/config/routes';
import { logger } from '@/lib/logger';
import type { ApiError } from '@/types/api';

export function useDeleteCategory(storeSlug: string, categoryId: string) {
  const queryClient = useQueryClient();
  const router      = useRouter();
  const t           = useTranslations('categories');

  return useMutation<void, ApiError, void>({
    mutationFn: () => deleteCategory(storeSlug, categoryId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories(storeSlug).lists(),
      });
      queryClient.removeQueries({
        queryKey: queryKeys.categories(storeSlug).detail(categoryId),
      });
      toast.success(t('form.deleteSuccess'));
      router.push(ROUTES.merchant.categories.list());
    },

    onError: (error) => {
      logger.error('Failed to delete category', error);
      toast.error(error.message ?? t('form.deleteError'));
    },
  });
}
