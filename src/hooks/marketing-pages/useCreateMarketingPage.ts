'use client';

/**
 * Hook for creating a new marketing page.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@/lib/navigation';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { createMarketingPage } from '@/lib/api/marketing-pages';
import { formatApiErrorMessage } from '@/lib/api/error-message';
import { queryKeys } from '@/lib/queryKeys';
import { ROUTES } from '@/config/routes';
import { logger } from '@/lib/logger';
import type { CreateMarketingPagePayload, MarketingPageDetail } from '@/types/marketing-page';
import type { ApiError } from '@/types/api';

export function useCreateMarketingPage(storeSlug: string) {
  const queryClient = useQueryClient();
  const router      = useRouter();
  const t           = useTranslations('cmsPages');

  return useMutation<MarketingPageDetail, ApiError, CreateMarketingPagePayload>({
    mutationFn: (payload) => createMarketingPage(storeSlug, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cmsPages(storeSlug).lists(),
      });
      toast.success(t('form.createSuccess'));
      router.push(ROUTES.merchant.cmsPages());
    },

    onError: (error) => {
      logger.error('Failed to create marketing page', error);
      toast.error(
        formatApiErrorMessage(error, {
          fallbackMessage: t('form.createError'),
          fieldMessages: {
            page_template_id: t('form.errors.pageTemplateInvalid'),
          },
        })
      );
    },
  });
}
