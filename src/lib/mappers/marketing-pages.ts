/**
 * Marketing page data mappers.
 * Transforms raw API types to view types for UI consumption.
 * 
 * Backend source: AdminStoreMarketingPageResource, StoreMarketingSectionResource
 */

import type {
  MarketingPageListItem,
  MarketingPageListItemView,
  MarketingPageDetail,
  MarketingPageDetailView,
  MarketingPageSeo,
  LocalizedString,
} from '@/types/marketing-page';
import { formatDate } from '@/lib/utils/date';

/**
 * Resolve a display string from a localized object.
 * Falls back to the first available value, then to the fallback string.
 */
export function resolveLocalizedString(
  value: LocalizedString | null | undefined,
  fallback = '',
): string {
  if (!value) return fallback;
  return value.en ?? value.ar ?? Object.values(value)[0] ?? fallback;
}

/**
 * Build a default SEO object when the API returns null or incomplete data.
 * Backend returns seo as array, but might be null for new pages.
 */
function defaultSeo(): MarketingPageSeo {
  return {
    meta_title:       { en: '', ar: '' },
    meta_description: { en: '', ar: '' },
    canonical_url:    '',
    robots:           '',
    og_image:         '',
  };
}

/**
 * Normalize SEO data from backend.
 * Backend can return:
 * - null (for new pages)
 * - object with nullable fields
 * - og_image can be string, array, or null
 */
function normalizeSeo(seo: any): MarketingPageSeo {
  if (!seo) return defaultSeo();

  // Normalize og_image: can be string, localized object, or null
  let ogImage = '';
  if (typeof seo.og_image === 'string') {
    ogImage = seo.og_image;
  } else if (seo.og_image && typeof seo.og_image === 'object') {
    ogImage = seo.og_image.en || seo.og_image.ar || Object.values(seo.og_image)[0] || '';
  }

  return {
    meta_title:       seo.meta_title || { en: '', ar: '' },
    meta_description: seo.meta_description || { en: '', ar: '' },
    canonical_url:    seo.canonical_url || '',
    robots:           seo.robots || '',
    og_image:         ogImage,
  };
}

/**
 * Map marketing page list item from raw API shape to view shape.
 */
export function mapMarketingPageListItem(
  raw: MarketingPageListItem,
  storeSlug: string,
): MarketingPageListItemView {
  return {
    id:             raw.id,
    storeSlug,
    title:          raw.title,
    slug:           raw.slug,
    template:       raw.template,
    pageTemplateId: raw.page_template_id ?? null,
    status:         raw.status,
    publishedAt:    raw.published_at,
    sortOrder:      raw.sort_order,
    displayTitle:   resolveLocalizedString(raw.title, `Page #${raw.id}`),
    createdAt:      formatDate(raw.created_at),
    updatedAt:      formatDate(raw.updated_at),
  };
}

/**
 * Map marketing page detail from raw API shape to view shape.
 * Backend returns section_type, frontend expects type.
 */
export function mapMarketingPageDetail(
  raw: MarketingPageDetail,
  storeSlug: string,
): MarketingPageDetailView {
  return {
    id:             raw.id,
    storeSlug,
    title:          raw.title || { en: '', ar: '' },
    slug:           raw.slug || { en: '', ar: '' },
    excerpt:        raw.excerpt || { en: '', ar: '' },
    template:       raw.template,
    pageTemplateId: raw.page_template_id ?? null,
    status:         raw.status,
    publishedAt:    raw.published_at,
    sortOrder:      raw.sort_order,
    isHomepage:     (raw as any).is_homepage ?? false,
    seo:            normalizeSeo(raw.seo),
    sections:    (raw.sections ?? []).map((s: any) => {
      // Backend uses 'section_type', frontend uses 'type'
      const type = s.section_type || s.type || '';
      return {
        type,
        identifier:   s.identifier || '',
        title:        s.title || { en: '', ar: '' },
        subtitle:     s.subtitle || { en: '', ar: '' },
        content:      s.content || {},
        settings:     s.settings || {},
        is_active:    s.is_active ?? true,
      };
    }),
    createdAt:   formatDate(raw.created_at),
    updatedAt:   formatDate(raw.updated_at),
  };
}
