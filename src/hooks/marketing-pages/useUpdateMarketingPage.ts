'use client';

/**
 * Hook for updating an existing marketing page.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { updateMarketingPage } from '@/lib/api/marketing-pages';
import { formatApiErrorMessage } from '@/lib/api/error-message';
import { queryKeys } from '@/lib/queryKeys';
import { logger } from '@/lib/logger';
import type { UpdateMarketingPagePayload, MarketingPageDetail } from '@/types/marketing-page';
import type { ApiError } from '@/types/api';

export function useUpdateMarketingPage(storeSlug: string, pageId: string) {
  const queryClient = useQueryClient();
  const t           = useTranslations('cmsPages');

  return useMutation<MarketingPageDetail, ApiError, UpdateMarketingPagePayload>({
    mutationFn: (payload) => updateMarketingPage(storeSlug, pageId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cmsPages(storeSlug).lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.cmsPages(storeSlug).detail(pageId),
      });
      toast.success(t('form.updateSuccess'));
    },

    onError: (error) => {
      logger.error('Failed to update marketing page', error);
      toast.error(
        formatApiErrorMessage(error, {
          fallbackMessage: t('form.updateError'),
          fieldMessages: {
            page_template_id: t('form.errors.pageTemplateInvalid'),
          },
        })
      );
    },
  });
}
