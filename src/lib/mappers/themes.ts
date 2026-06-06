/**
 * Mappers for Themes.
 * Transform raw API responses to view-friendly camelCase types.
 */

import type { Theme, ThemeView, ThemeListItem, ThemeListItemView } from '@/types/theme';

/**
 * Map raw API theme to view type.
 */
export function mapTheme(theme: Theme): ThemeView {
  return {
    id: theme.id,
    storeId: theme.store_id,
    name: theme.name,
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
export function mapThemeListItem(item: ThemeListItem): ThemeListItemView {
  return {
    id: item.id,
    storeId: item.store_id,
    name: item.name,
    description: item.description,
    isActive: item.is_active,
    isPublished: item.is_published,
    sectionsCount: item.sections_count,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}
