import { clientApi } from './client';
import { API_ROUTES } from '@/config/routes';
import type { SectionSchema } from '@/types/theme';

export async function getSectionSchemas(storeId: string): Promise<SectionSchema[]> {
  try {
    console.log('[getSectionSchemas] Calling API with storeId:', storeId, 'URL:', API_ROUTES.store(storeId).sectionSchemas());
    const response = await clientApi.get<SectionSchema[]>(
      API_ROUTES.store(storeId).sectionSchemas()
    );
    console.log('[getSectionSchemas] Response:', response);
    console.log('[getSectionSchemas] Returning:', response ?? []);
    return response ?? [];
  } catch (error) {
    console.error('[getSectionSchemas] Failed to fetch section schemas:', error);
    return [];
  }
}
