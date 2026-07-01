/**
 * Brand data mappers.
 * Transforms raw API types to view types for UI consumption.
 */

import type {
  BrandListItem,
  BrandListItemView,
  BrandDetail,
  BrandDetailView,
} from '@/types/brand';
import { formatDate } from '@/lib/utils/date';

/**
 * Map brand list item from raw API shape to view shape.
 */
export function mapBrandListItem(raw: BrandListItem, storeSlug: string): BrandListItemView {
  return {
    id:            raw.id,
    storeSlug,
    name:          raw.name,
    slug:          raw.slug,
    description:   raw.description,
    logoUrl:       raw.logo_url,
    sortOrder:     raw.sort_order,
    isActive:      raw.is_active,
    productsCount: raw.products_count,
    createdAt:     formatDate(raw.created_at),
    deletedAt:     raw.deleted_at,
  };
}

/**
 * Map brand detail from raw API shape to view shape.
 */
export function mapBrandDetail(raw: BrandDetail, storeSlug: string): BrandDetailView {
  return {
    id:            raw.id,
    storeSlug,
    name:          raw.name,
    slug:          raw.slug,
    description:   raw.description,
    logoUrl:       raw.logo_url,
    sortOrder:     raw.sort_order,
    isActive:      raw.is_active,
    productsCount: raw.products_count,
    createdAt:     formatDate(raw.created_at),
    updatedAt:     formatDate(raw.updated_at),
    deletedAt:     raw.deleted_at,
  };
}
