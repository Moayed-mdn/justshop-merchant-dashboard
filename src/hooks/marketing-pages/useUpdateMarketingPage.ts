'use client';

/**
 * Hook for updating an existing marketing page.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { updateMarketingPage } from '@/lib/api/marketing-pages';
import { queryKeys } from '@/lib/queryKeys';
import { logger } from '@/lib/logger';
import type { UpdateMarketingPagePayload, MarketingPageDetail } from '@/types/marketing-page';
import type { ApiError } from '@/types/api';

export function useUpdateMarketingPage(storeId: string, pageId: string) {
  const queryClient = useQueryClient();
  const t           = useTranslations('cmsPages');

  return useMutation<MarketingPageDetail, ApiError, UpdateMarketingPagePayload>({
    mutationFn: (payload) => updateMarketingPage(storeId, pageId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cmsPages(storeId).lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.cmsPages(storeId).detail(pageId),
      });
      toast.success(t('form.updateSuccess'));
    },

    onError: (error) => {
      logger.error('Failed to update marketing page', error);
      toast.error(error.message ?? t('form.updateError'));
    },
  });
}
