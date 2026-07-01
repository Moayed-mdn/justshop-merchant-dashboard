'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSystemTemplate } from '@/lib/api/system-templates';
import { queryKeys } from '@/lib/queryKeys';
import type {
  SystemTemplate,
  UpdateSystemTemplatePayload,
} from '@/types/theme';
import type { ApiError } from '@/types/api';

export function useUpdateSystemTemplate(storeSlug: string, themeSlug: string) {
  const queryClient = useQueryClient();

  return useMutation<
    SystemTemplate,
    ApiError,
    { templateId: string; payload: UpdateSystemTemplatePayload }
  >({
    mutationFn: ({ templateId, payload }) =>
      updateSystemTemplate(storeSlug, themeSlug, templateId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.systemTemplates(storeSlug, themeSlug).lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.systemTemplates(storeSlug, themeSlug).detail(variables.templateId),
      });
    },
  });
}
