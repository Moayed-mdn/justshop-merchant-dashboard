/**
 * Marketing page data mappers.
 * Transforms raw API types to view types for UI consumption.
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
 * Build a default SEO object when the API returns null.
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
 * Map marketing page list item from raw API shape to view shape.
 */
export function mapMarketingPageListItem(
  raw: MarketingPageListItem,
): MarketingPageListItemView {
  return {
    id:           raw.id,
    storeId:      raw.store_id,
    title:        raw.title,
    slug:         raw.slug,
    template:     raw.template,
    status:       raw.status,
    publishedAt:  raw.published_at,
    sortOrder:    raw.sort_order,
    displayTitle: resolveLocalizedString(raw.title, `Page #${raw.id}`),
    createdAt:    formatDate(raw.created_at),
    updatedAt:    formatDate(raw.updated_at),
  };
}

/**
 * Map marketing page detail from raw API shape to view shape.
 */
export function mapMarketingPageDetail(
  raw: MarketingPageDetail,
): MarketingPageDetailView {
  return {
    id:          raw.id,
    storeId:     raw.store_id,
    title:       raw.title,
    slug:        raw.slug,
    excerpt:     raw.excerpt,
    template:    raw.template,
    status:      raw.status,
    publishedAt: raw.published_at,
    sortOrder:   raw.sort_order,
    seo:         raw.seo ?? defaultSeo(),
    sections:    (raw.sections ?? []).map((s: any) => {
      const type = s.type || s.section_type || '';
      return {
        ...s,
        type,
        section_type: type,
      };
    }),
    createdAt:   formatDate(raw.created_at),
    updatedAt:   formatDate(raw.updated_at),
  };
}
