'use client';

/**
 * Hook for restoring a soft-deleted brand.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { restoreBrand } from '@/lib/api/brands';
import { queryKeys } from '@/lib/queryKeys';
import { logger } from '@/lib/logger';
import type { ApiError } from '@/types/api';

export function useRestoreBrand(storeSlug: string, brandId: string) {
  const queryClient = useQueryClient();
  const t           = useTranslations('brands');

  return useMutation<unknown, ApiError, void>({
    mutationFn: () => restoreBrand(storeSlug, brandId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.brands(storeSlug).lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.brands(storeSlug).detail(brandId),
      });
      toast.success(t('form.restoreSuccess'));
    },

    onError: (error) => {
      logger.error('Failed to restore brand', error);
      toast.error(error.message ?? t('form.restoreError'));
    },
  });
}
