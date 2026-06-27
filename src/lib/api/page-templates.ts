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
  storeId: string,
): Promise<PageTemplate[]> {
  const response = await clientApi.get<ApiResponse<TemplateListResponse>>(
    API_ROUTES.store(storeId).templates().list(),
  );
  return response.data.data;
}

export async function getPageTemplateDetail(
  storeId: string,
  templateId: string,
): Promise<PageTemplate> {
  const response = await clientApi.get<ApiResponse<PageTemplate>>(
    API_ROUTES.store(storeId).templates().detail(templateId),
  );
  return response.data;
}

export async function createPageTemplate(
  storeId: string,
  payload: CreatePageTemplatePayload,
): Promise<PageTemplate> {
  const response = await clientApi.post<ApiResponse<PageTemplate>>(
    API_ROUTES.store(storeId).templates().create(),
    payload,
  );
  return response.data;
}

export async function updatePageTemplate(
  storeId: string,
  templateId: string,
  payload: UpdatePageTemplatePayload,
): Promise<PageTemplate> {
  const response = await clientApi.put<ApiResponse<PageTemplate>>(
    API_ROUTES.store(storeId).templates().update(templateId),
    payload,
  );
  return response.data;
}

export async function deletePageTemplate(
  storeId: string,
  templateId: string,
): Promise<void> {
  await clientApi.delete(
    API_ROUTES.store(storeId).templates().delete(templateId),
  );
}

export async function duplicatePageTemplate(
  storeId: string,
  templateId: string,
  payload: DuplicatePageTemplatePayload,
): Promise<PageTemplate> {
  const response = await clientApi.post<ApiResponse<PageTemplate>>(
    API_ROUTES.store(storeId).templates().duplicate(templateId),
    payload,
  );
  return response.data;
}
