/**
 * Marketing Pages API functions (client-side).
 * All calls go through clientApi → /api/proxy → Laravel.
 */

import { clientApi } from '@/lib/api/client';
import { API_ROUTES } from '@/config/routes';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type {
  MarketingPageListItem,
  MarketingPageDetail,
  CreateMarketingPagePayload,
  UpdateMarketingPagePayload,
} from '@/types/marketing-page';
import type { MarketingPageFilters } from '@/schemas/marketing-pages';
import type { SectionTypeOption } from '@/types/marketing-page';

/**
 * Fetch paginated marketing pages list.
 */
export async function getMarketingPages(
  storeSlug: string,
  filters: MarketingPageFilters,
): Promise<PaginatedResponse<MarketingPageListItem>> {
  const params: Record<string, string | number> = {};

  if (filters.search)              params.search   = filters.search;
  if (filters.status !== 'all')    params.status   = filters.status;
  if (filters.template !== 'all')  params.template = filters.template;
  if (filters.page !== 1)          params.page     = filters.page;
  if (filters.perPage !== 15)      params.per_page = filters.perPage;

  return clientApi.get<PaginatedResponse<MarketingPageListItem>>(
    API_ROUTES.store(storeSlug).cmsPages().list(),
    { params },
  );
}

/**
 * Fetch single marketing page by ID.
 */
export async function getMarketingPageDetail(
  storeSlug: string,
  pageId: string,
): Promise<MarketingPageDetail> {
  const response = await clientApi.get<ApiResponse<MarketingPageDetail>>(
    API_ROUTES.store(storeSlug).cmsPages().detail(pageId),
  );
  return response.data;
}

/**
 * Transform frontend payload to backend format.
 * Frontend uses 'type' for sections, backend expects 'section_type'.
 */
function transformPayloadForBackend(payload: CreateMarketingPagePayload | UpdateMarketingPagePayload): any {
  return {
    title: payload.title,
    slug: payload.slug,
    excerpt: payload.excerpt,
    template: payload.template,
    page_template_id: payload.page_template_id,
    status: payload.status,
    published_at: payload.published_at,
    sort_order: payload.sort_order,
    is_homepage: payload.is_homepage,
    seo: payload.seo,
    // `section.sort_order` never actually exists on MarketingPageSection —
    // it's never populated by the mapper (see mapMarketingPageDetail) or the
    // form schema, so `(section as any).sort_order` was always `undefined`
    // and got silently dropped from the JSON body. That meant every section
    // was saved with no explicit order, so reordering sections via the
    // move up/down buttons in SectionsBuilder was thrown away on save even
    // though it looked correct in the UI right up until you reloaded the
    // page. The array position IS the intended order (that's what move()
    // from useFieldArray mutates), so we send that as sort_order instead.
    sections: payload.sections.map((section, index) => ({
      section_type: section.type,
      identifier: section.identifier,
      sort_order: index,
      title: section.title,
      subtitle: section.subtitle,
      content: section.content,
      settings: section.settings,
      is_active: section.is_active,
    })),
  };
}

/**
 * Create a new marketing page.
 */
export async function createMarketingPage(
  storeSlug: string,
  payload: CreateMarketingPagePayload,
): Promise<MarketingPageDetail> {
  const transformedPayload = transformPayloadForBackend(payload);
  const response = await clientApi.post<ApiResponse<MarketingPageDetail>>(
    API_ROUTES.store(storeSlug).cmsPages().create(),
    transformedPayload,
  );
  return response.data;
}

/**
 * Update an existing marketing page.
 */
export async function updateMarketingPage(
  storeSlug: string,
  pageId: string,
  payload: UpdateMarketingPagePayload,
): Promise<MarketingPageDetail> {
  const transformedPayload = transformPayloadForBackend(payload);
  const response = await clientApi.put<ApiResponse<MarketingPageDetail>>(
    API_ROUTES.store(storeSlug).cmsPages().update(pageId),
    transformedPayload,
  );
  return response.data;
}

/**
 * Delete a marketing page by ID.
 */
export async function deleteMarketingPage(
  storeSlug: string,
  pageId: string,
): Promise<void> {
  await clientApi.delete(
    API_ROUTES.store(storeSlug).cmsPages().delete(pageId),
  );
}

/**
 * Publish a marketing page.
 * Uses the dedicated publish endpoint which handles the publish timestamp
 * and validates the transition with the marketing.store.publish permission.
 */
export async function publishMarketingPage(
  storeSlug: string,
  pageId: string,
): Promise<MarketingPageDetail> {
  const response = await clientApi.post<ApiResponse<MarketingPageDetail>>(
    API_ROUTES.store(storeSlug).cmsPages().publish(pageId),
  );
  return response.data;
}

/**
 * Unpublish a marketing page.
 * Uses the dedicated unpublish endpoint which validates the transition
 * with the marketing.store.publish permission.
 */
export async function unpublishMarketingPage(
  storeSlug: string,
  pageId: string,
): Promise<MarketingPageDetail> {
  const response = await clientApi.post<ApiResponse<MarketingPageDetail>>(
    API_ROUTES.store(storeSlug).cmsPages().unpublish(pageId),
  );
  return response.data;
}

/**
 * Fetch available marketing section types.
 */
export async function getMarketingSectionTypes(
  storeSlug: string,
): Promise<SectionTypeOption[]> {
  const response = await clientApi.get<ApiResponse<SectionTypeOption[]>>(
    API_ROUTES.store(storeSlug).sectionTypes(),
  );
  return response.data;
}

/**
 * Check if a homepage already exists for the store.
 * Returns the existing homepage info or null.
 */
export async function checkHomepage(
  storeSlug: string,
  excludeId?: string,
): Promise<{ exists: boolean; page: { id: number; title: Record<string, string>; slug: Record<string, string> } | null }> {
  const params: Record<string, string | number> = {};
  if (excludeId) params.exclude_id = excludeId;

  const response = await clientApi.get<ApiResponse<{ exists: boolean; page: any }>>(
    `${API_ROUTES.store(storeSlug).cmsPages().list()}/check-homepage`,
    { params },
  );
  return response.data;
}
