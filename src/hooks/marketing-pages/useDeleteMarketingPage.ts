'use client';

/**
 * Hook for deleting a marketing page.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@/lib/navigation';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { deleteMarketingPage } from '@/lib/api/marketing-pages';
import { queryKeys } from '@/lib/queryKeys';
import { ROUTES } from '@/config/routes';
import { logger } from '@/lib/logger';
import type { ApiError } from '@/types/api';

export function useDeleteMarketingPage(storeSlug: string, pageId: string) {
  const queryClient = useQueryClient();
  const router      = useRouter();
  const t           = useTranslations('cmsPages');

  return useMutation<void, ApiError, void>({
    mutationFn: () => deleteMarketingPage(storeSlug, pageId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cmsPages(storeSlug).lists(),
      });
      queryClient.removeQueries({
        queryKey: queryKeys.cmsPages(storeSlug).detail(pageId),
      });
      toast.success(t('form.deleteSuccess'));
      router.push(ROUTES.merchant.cmsPages());
    },

    onError: (error) => {
      logger.error('Failed to delete marketing page', error);
      toast.error(error.message ?? t('form.deleteError'));
    },
  });
}
