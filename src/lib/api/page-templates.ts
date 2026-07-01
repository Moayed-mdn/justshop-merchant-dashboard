import { clientApi } from '@/lib/api/client';
import { API_ROUTES } from '@/config/routes';
import type { ApiResponse } from '@/types/api';
import type {
  PageTemplate,
  CreatePageTemplatePayload,
  UpdatePageTemplatePayload,
  DuplicatePageTemplatePayload,
} from '@/types/theme';

interface TemplateListResponse {
  data: PageTemplate[];
}

export async function getPageTemplates(
  storeSlug: string,
): Promise<PageTemplate[]> {
  const response = await clientApi.get<ApiResponse<TemplateListResponse>>(
    API_ROUTES.store(storeSlug).templates().list(),
  );
  return response.data.data;
}

export async function getPageTemplateDetail(
  storeSlug: string,
  templateId: string,
): Promise<PageTemplate> {
  const response = await clientApi.get<ApiResponse<PageTemplate>>(
    API_ROUTES.store(storeSlug).templates().detail(templateId),
  );
  return response.data;
}

export async function createPageTemplate(
  storeSlug: string,
  payload: CreatePageTemplatePayload,
): Promise<PageTemplate> {
  const response = await clientApi.post<ApiResponse<PageTemplate>>(
    API_ROUTES.store(storeSlug).templates().create(),
    payload,
  );
  return response.data;
}

export async function updatePageTemplate(
  storeSlug: string,
  templateId: string,
  payload: UpdatePageTemplatePayload,
): Promise<PageTemplate> {
  const response = await clientApi.put<ApiResponse<PageTemplate>>(
    API_ROUTES.store(storeSlug).templates().update(templateId),
    payload,
  );
  return response.data;
}

export async function deletePageTemplate(
  storeSlug: string,
  templateId: string,
): Promise<void> {
  await clientApi.delete(
    API_ROUTES.store(storeSlug).templates().delete(templateId),
  );
}

export async function duplicatePageTemplate(
  storeSlug: string,
  templateId: string,
  payload: DuplicatePageTemplatePayload,
): Promise<PageTemplate> {
  const response = await clientApi.post<ApiResponse<PageTemplate>>(
    API_ROUTES.store(storeSlug).templates().duplicate(templateId),
    payload,
  );
  return response.data;
}
