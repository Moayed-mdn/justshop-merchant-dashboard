'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@/lib/navigation';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { createTag } from '@/lib/api/tags';
import { queryKeys } from '@/lib/queryKeys';
import { ROUTES } from '@/config/routes';
import { logger } from '@/lib/logger';
import type { CreateTagPayload } from '@/types/tag';
import type { ApiError } from '@/types/api';

export function useCreateTag(storeSlug: string) {
  const queryClient = useQueryClient();
  const router      = useRouter();
  const t           = useTranslations('tags');

  return useMutation<unknown, ApiError, CreateTagPayload>({
    mutationFn: (payload) => createTag(storeSlug, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tags(storeSlug).lists() });
      toast.success(t('form.createSuccess'));
      router.push(ROUTES.merchant.tags.list());
    },

    onError: (error) => {
      logger.error('Failed to create tag', error);
      toast.error(error.message ?? t('form.createError'));
    },
  });
}
