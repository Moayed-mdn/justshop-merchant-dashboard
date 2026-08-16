/**
 * Mappers for Themes.
 * Transform raw API responses to view-friendly camelCase types.
 */

import type { Theme, ThemeView, ThemeListItem, ThemeListItemView } from '@/types/theme';

/**
 * Map raw API theme to view type.
 */
export function mapTheme(theme: Theme, storeSlug: string): ThemeView {
  return {
    id: theme.id,
    storeSlug,
    name: theme.name,
    slug: theme.slug,
    description: theme.description,
    isActive: theme.is_active,
    isPublished: theme.is_published,
    settings: theme.settings,
    createdAt: theme.created_at,
    updatedAt: theme.updated_at,
  };
}

/**
 * Map raw API theme list item to view type.
 */
export function mapThemeListItem(item: ThemeListItem, storeSlug: string): ThemeListItemView {
  return {
    id: item.id,
    storeSlug,
    name: item.name,
    slug: item.slug,
    description: item.description,
    isActive: item.is_active,
    isPublished: item.is_published,
    sectionsCount: item.sections_count,
    settings: item.settings, // Include settings for color schemes
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}
