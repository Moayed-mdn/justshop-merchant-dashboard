/**
 * Hero Banners API functions (client-side).
 * All calls go through clientApi → /api/proxy → Laravel.
 */

import { clientApi } from '@/lib/api/client';
import { API_ROUTES } from '@/config/routes';
import type { ApiResponse } from '@/types/api';

export type HeroVisualType = 'image' | 'gradient' | 'video';
export type HeroLinkTarget = '_self' | '_blank';

export interface HeroBannerTranslation {
  id?: number;
  locale: 'en' | 'ar';
  title: string;
  subtitle?: string;
  cta_text: string;
}

export interface HeroBanner {
  id: number;
  store_id: number;
  cat_url: string;
  position: number;
  visual_type: HeroVisualType;
  image_path?: string;
  image_url?: string;
  gradient_from?: string;
  gradient_to?: string;
  link_url?: string;
  link_text?: string;
  link_target?: HeroLinkTarget;
  is_active: boolean;
  starts_at?: string;
  ends_at?: string;
  translations: HeroBannerTranslation[];
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface CreateHeroBannerData {
  cat_url: string;
  position: number;
  visual_type: HeroVisualType;
  image_path?: string;
  gradient_from?: string;
  gradient_to?: string;
  link_url?: string;
  link_text?: string;
  link_target?: HeroLinkTarget;
  is_active?: boolean;
  starts_at?: string;
  ends_at?: string;
  translations: HeroBannerTranslation[];
}

export interface UpdateHeroBannerData extends Partial<CreateHeroBannerData> {}

export interface HeroBannersFilters {
  status?: 'all' | 'active' | 'inactive' | 'trashed';
  search?: string;
}

/**
 * Fetch all hero banners for a store.
 */
export async function getHeroBanners(
  storeId: string,
  filters?: HeroBannersFilters,
): Promise<HeroBanner[]> {
  const params: Record<string, string> = {};
  if (filters?.status && filters.status !== 'all') params.status = filters.status;
  if (filters?.search) params.search = filters.search;

  const response = await clientApi.get<ApiResponse<HeroBanner[]>>(
    API_ROUTES.store(storeId).heroBanners().list(),
    { params },
  );
  return response.data;
}

/**
 * Fetch a single hero banner.
 */
export async function getHeroBanner(
  storeId: string,
  bannerId: string,
): Promise<HeroBanner> {
  const response = await clientApi.get<ApiResponse<HeroBanner>>(
    API_ROUTES.store(storeId).heroBanners().detail(bannerId),
  );
  return response.data;
}

/**
 * Create a new hero banner.
 */
export async function createHeroBanner(
  storeId: string,
  data: CreateHeroBannerData,
): Promise<HeroBanner> {
  const response = await clientApi.post<ApiResponse<HeroBanner>>(
    API_ROUTES.store(storeId).heroBanners().create(),
    data,
  );
  return response.data;
}

/**
 * Update an existing hero banner.
 */
export async function updateHeroBanner(
  storeId: string,
  bannerId: string,
  data: UpdateHeroBannerData,
): Promise<HeroBanner> {
  const response = await clientApi.patch<ApiResponse<HeroBanner>>(
    API_ROUTES.store(storeId).heroBanners().update(bannerId),
    data,
  );
  return response.data;
}

/**
 * Soft-delete a hero banner.
 */
export async function deleteHeroBanner(
  storeId: string,
  bannerId: string,
): Promise<void> {
  await clientApi.delete(
    API_ROUTES.store(storeId).heroBanners().delete(bannerId),
  );
}

/**
 * Restore a soft-deleted hero banner.
 */
export async function restoreHeroBanner(
  storeId: string,
  bannerId: string,
): Promise<HeroBanner> {
  const response = await clientApi.patch<ApiResponse<HeroBanner>>(
    API_ROUTES.store(storeId).heroBanners().restore(bannerId),
  );
  return response.data;
}
