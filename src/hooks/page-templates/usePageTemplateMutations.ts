'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createPageTemplate,
  updatePageTemplate,
  deletePageTemplate,
  duplicatePageTemplate,
} from '@/lib/api/page-templates';
import { queryKeys } from '@/lib/queryKeys';
import type {
  PageTemplate,
  CreatePageTemplatePayload,
  UpdatePageTemplatePayload,
  DuplicatePageTemplatePayload,
} from '@/types/theme';
import type { ApiError } from '@/types/api';

export function useCreatePageTemplate(storeId: string) {
  const queryClient = useQueryClient();

  return useMutation<PageTemplate, ApiError, CreatePageTemplatePayload>({
    mutationFn: (payload) => createPageTemplate(storeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.pageTemplates(storeId).lists(),
      });
    },
  });
}

export function useUpdatePageTemplate(storeId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    PageTemplate,
    ApiError,
    { templateId: string; payload: UpdatePageTemplatePayload }
  >({
    mutationFn: ({ templateId, payload }) =>
      updatePageTemplate(storeId, templateId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.pageTemplates(storeId).lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.pageTemplates(storeId).detail(variables.templateId),
      });
    },
  });
}

export function useDeletePageTemplate(storeId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: (templateId) => deletePageTemplate(storeId, templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.pageTemplates(storeId).lists(),
      });
    },
  });
}

export function useDuplicatePageTemplate(storeId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    PageTemplate,
    ApiError,
    { templateId: string; payload: DuplicatePageTemplatePayload }
  >({
    mutationFn: ({ templateId, payload }) =>
      duplicatePageTemplate(storeId, templateId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.pageTemplates(storeId).lists(),
      });
    },
  });
}
