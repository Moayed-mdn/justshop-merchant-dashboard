import { clientApi } from '@/lib/api/client';
import { API_ROUTES } from '@/config/routes';
import type { ApiResponse } from '@/types/api';
import type { ThemeBlock, ThemeBlockView } from '@/types/theme';

export async function getBlocks(
  storeSlug: string,
  themeSlug: string,
  sectionId: string,
): Promise<ThemeBlock[]> {
  const response = await clientApi.get<ApiResponse<{ data: ThemeBlock[] }>>(
    API_ROUTES.store(storeSlug).themes().sections(themeSlug).blocks(sectionId).list(),
  );
  return response.data.data;
}

export async function updateBlock(
  storeSlug: string,
  themeSlug: string,
  sectionId: string,
  blockId: string,
  payload: Partial<{
    name: string;
    settings: Record<string, unknown>;
    content: Record<string, unknown>;
    position: number;
    is_enabled: boolean;
  }>,
): Promise<ThemeBlock> {
  const response = await clientApi.put<ApiResponse<ThemeBlock>>(
    API_ROUTES.store(storeSlug).themes().sections(themeSlug).blocks(sectionId).update(blockId),
    payload,
  );
  return response.data;
}
