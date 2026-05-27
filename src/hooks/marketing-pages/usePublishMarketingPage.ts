'use client';

/**
 * Hook for publishing or unpublishing a marketing page.
 * Uses the dedicated publish/unpublish endpoints which handle the publish
 * timestamp, validate the transition, and check the marketing.store.publish
 * permission separately from update.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { publishMarketingPage, unpublishMarketingPage } from '@/lib/api/marketing-pages';
import { queryKeys } from '@/lib/queryKeys';
import { logger } from '@/lib/logger';
import type { MarketingPageDetail } from '@/types/marketing-page';
import type { ApiError } from '@/types/api';

export function usePublishMarketingPage(storeId: string, pageId: string) {
  const queryClient = useQueryClient();
  const t           = useTranslations('cmsPages');

  return useMutation<MarketingPageDetail, ApiError, void>({
    mutationFn: () => publishMarketingPage(storeId, pageId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cmsPages(storeId).lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.cmsPages(storeId).detail(pageId),
      });
      toast.success(t('form.publishSuccess'));
    },

    onError: (error) => {
      logger.error('Failed to publish marketing page', { error });
      toast.error(error.message ?? t('form.publishError'));
    },
  });
}

export function useUnpublishMarketingPage(storeId: string, pageId: string) {
  const queryClient = useQueryClient();
  const t           = useTranslations('cmsPages');

  return useMutation<MarketingPageDetail, ApiError, void>({
    mutationFn: () => unpublishMarketingPage(storeId, pageId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cmsPages(storeId).lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.cmsPages(storeId).detail(pageId),
      });
      toast.success(t('form.unpublishSuccess'));
    },

    onError: (error) => {
      logger.error('Failed to unpublish marketing page', { error });
      toast.error(error.message ?? t('form.unpublishError'));
    },
  });
}
