import { clientApi } from '@/lib/api/client';
import { API_ROUTES } from '@/config/routes';
import type { ApiResponse } from '@/types/api';
import type { ThemeSectionGroup, ThemeSectionGroupView } from '@/types/theme';

export async function getSectionGroups(
  storeSlug: string,
  themeSlug: string,
): Promise<ThemeSectionGroup[]> {
  const response = await clientApi.get<ApiResponse<ThemeSectionGroup[]>>(
    API_ROUTES.store(storeSlug).themes().sectionGroups.list(themeSlug),
  );
  return response.data;
}

export async function getSectionGroupDetail(
  storeSlug: string,
  themeSlug: string,
  groupId: string,
): Promise<ThemeSectionGroup> {
  const response = await clientApi.get<ApiResponse<ThemeSectionGroup>>(
    API_ROUTES.store(storeSlug).themes().sectionGroups.detail(themeSlug, groupId),
  );
  return response.data;
}

export async function updateSectionGroup(
  storeSlug: string,
  themeSlug: string,
  groupId: string,
  payload: {
    name?: string;
    sections?: Record<string, { type: string; settings: Record<string, unknown> }>;
    order?: string[];
  },
): Promise<ThemeSectionGroup> {
  const response = await clientApi.put<ApiResponse<ThemeSectionGroup>>(
    API_ROUTES.store(storeSlug).themes().sectionGroups.update(themeSlug, groupId),
    payload,
  );
  return response.data;
}
