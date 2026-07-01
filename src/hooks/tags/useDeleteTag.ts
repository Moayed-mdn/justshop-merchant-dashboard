'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@/lib/navigation';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { deleteTag } from '@/lib/api/tags';
import { queryKeys } from '@/lib/queryKeys';
import { ROUTES } from '@/config/routes';
import { logger } from '@/lib/logger';
import type { ApiError } from '@/types/api';

export function useDeleteTag(storeSlug: string, tagId: string) {
  const queryClient = useQueryClient();
  const router      = useRouter();
  const t           = useTranslations('tags');

  return useMutation<void, ApiError, void>({
    mutationFn: () => deleteTag(storeSlug, tagId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tags(storeSlug).lists() });
      queryClient.removeQueries({ queryKey: queryKeys.tags(storeSlug).detail(tagId) });
      toast.success(t('form.deleteSuccess'));
      router.push(ROUTES.merchant.tags.list());
    },

    onError: (error) => {
      logger.error('Failed to delete tag', error);
      toast.error(error.message ?? t('form.deleteError'));
    },
  });
}
