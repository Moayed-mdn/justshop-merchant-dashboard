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

export function useCreatePageTemplate(storeSlug: string) {
  const queryClient = useQueryClient();

  return useMutation<PageTemplate, ApiError, CreatePageTemplatePayload>({
    mutationFn: (payload) => createPageTemplate(storeSlug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.pageTemplates(storeSlug).lists(),
      });
    },
  });
}

export function useUpdatePageTemplate(storeSlug: string) {
  const queryClient = useQueryClient();

  return useMutation<
    PageTemplate,
    ApiError,
    { templateId: string; payload: UpdatePageTemplatePayload }
  >({
    mutationFn: ({ templateId, payload }) =>
      updatePageTemplate(storeSlug, templateId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.pageTemplates(storeSlug).lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.pageTemplates(storeSlug).detail(variables.templateId),
      });
    },
  });
}

export function useDeletePageTemplate(storeSlug: string) {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: (templateId) => deletePageTemplate(storeSlug, templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.pageTemplates(storeSlug).lists(),
      });
    },
  });
}

export function useDuplicatePageTemplate(storeSlug: string) {
  const queryClient = useQueryClient();

  return useMutation<
    PageTemplate,
    ApiError,
    { templateId: string; payload: DuplicatePageTemplatePayload }
  >({
    mutationFn: ({ templateId, payload }) =>
      duplicatePageTemplate(storeSlug, templateId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.pageTemplates(storeSlug).lists(),
      });
    },
  });
}
