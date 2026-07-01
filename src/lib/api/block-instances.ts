import { clientApi } from '@/lib/api/client';
import { API_ROUTES } from '@/config/routes';
import type { ApiResponse } from '@/types/api';
import type { ThemeBlockInstance, CreateBlockInstancePayload } from '@/types/theme';

export async function getBlockInstances(
  storeSlug: string,
  themeSlug: string,
  sectionId: string,
): Promise<ThemeBlockInstance[]> {
  const response = await clientApi.get<ApiResponse<{ data: ThemeBlockInstance[] }>>(
    API_ROUTES.store(storeSlug).themes().sections(themeSlug).blockInstances(sectionId).list(),
  );
  return response.data.data;
}

export async function getBlockInstanceDetail(
  storeSlug: string,
  themeSlug: string,
  sectionId: string,
  blockInstanceId: string,
): Promise<ThemeBlockInstance> {
  const response = await clientApi.get<ApiResponse<ThemeBlockInstance>>(
    API_ROUTES.store(storeSlug).themes().sections(themeSlug).blockInstances(sectionId).detail(blockInstanceId),
  );
  return response.data;
}

export async function createBlockInstance(
  storeSlug: string,
  themeSlug: string,
  sectionId: string,
  payload: CreateBlockInstancePayload,
): Promise<ThemeBlockInstance> {
  const response = await clientApi.post<ApiResponse<ThemeBlockInstance>>(
    API_ROUTES.store(storeSlug).themes().sections(themeSlug).blockInstances(sectionId).create(),
    payload,
  );
  return response.data;
}

export async function updateBlockInstance(
  storeSlug: string,
  themeSlug: string,
  sectionId: string,
  blockInstanceId: string,
  payload: Partial<CreateBlockInstancePayload> & { is_enabled?: boolean },
): Promise<ThemeBlockInstance> {
  const response = await clientApi.put<ApiResponse<ThemeBlockInstance>>(
    API_ROUTES.store(storeSlug).themes().sections(themeSlug).blockInstances(sectionId).update(blockInstanceId),
    payload,
  );
  return response.data;
}

export async function deleteBlockInstance(
  storeSlug: string,
  themeSlug: string,
  sectionId: string,
  blockInstanceId: string,
): Promise<void> {
  await clientApi.delete(
    API_ROUTES.store(storeSlug).themes().sections(themeSlug).blockInstances(sectionId).delete(blockInstanceId),
  );
}

export async function reorderBlockInstances(
  storeSlug: string,
  themeSlug: string,
  sectionId: string,
  blockIds: number[],
): Promise<void> {
  await clientApi.post(
    API_ROUTES.store(storeSlug).themes().sections(themeSlug).blockInstances(sectionId).reorder(),
    { block_ids: blockIds },
  );
}
