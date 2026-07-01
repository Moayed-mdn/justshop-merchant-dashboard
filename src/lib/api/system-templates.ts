import { clientApi } from '@/lib/api/client';
import { API_ROUTES } from '@/config/routes';
import type { ApiResponse } from '@/types/api';
import type { SystemTemplate, UpdateSystemTemplatePayload } from '@/types/theme';

interface SystemTemplateListResponse {
  data: SystemTemplate[];
}

export async function getSystemTemplates(
  storeSlug: string,
  themeSlug: string,
): Promise<SystemTemplate[]> {
  const response = await clientApi.get<ApiResponse<SystemTemplateListResponse>>(
    API_ROUTES.store(storeSlug).themes().systemTemplates.list(themeSlug),
  );
  return response.data.data;
}

export async function getSystemTemplateDetail(
  storeSlug: string,
  themeSlug: string,
  templateId: string,
): Promise<SystemTemplate> {
  const response = await clientApi.get<ApiResponse<SystemTemplate>>(
    API_ROUTES.store(storeSlug).themes().systemTemplates.detail(themeSlug, templateId),
  );
  return response.data;
}

export async function updateSystemTemplate(
  storeSlug: string,
  themeSlug: string,
  templateId: string,
  payload: UpdateSystemTemplatePayload,
): Promise<SystemTemplate> {
  const response = await clientApi.put<ApiResponse<SystemTemplate>>(
    API_ROUTES.store(storeSlug).themes().systemTemplates.update(themeSlug, templateId),
    payload,
  );
  return response.data;
}
