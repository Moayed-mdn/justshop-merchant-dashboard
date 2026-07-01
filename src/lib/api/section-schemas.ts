import { clientApi } from './client';
import { API_ROUTES } from '@/config/routes';
import type { SectionSchema } from '@/types/theme';

export async function getSectionSchemas(storeSlug: string): Promise<SectionSchema[]> {
  try {
    const response = await clientApi.get<{ data: SectionSchema[] }>(
      API_ROUTES.store(storeSlug).sectionSchemas()
    );
    return response.data ?? [];
  } catch (error) {
    console.error('[getSectionSchemas] Failed to fetch section schemas:', error);
    return [];
  }
}
