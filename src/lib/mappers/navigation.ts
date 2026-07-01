/**
 * Navigation menu data mappers.
 * Transforms snake_case API responses to camelCase view types.
 */

import type {
  LocalizedNavigationLabel,
  NavigationMenuListItem,
  NavigationMenuListItemView,
  NavigationMenuDetail,
  NavigationMenuDetailView,
  NavigationMenuItem,
  NavigationMenuItemView,
} from '@/types/navigation';

type NavigationMenuItemApi = NavigationMenuItem & {
  menu_id?: number;
};

export function parseNavigationLabel(label: string): LocalizedNavigationLabel {
  try {
    const parsed = JSON.parse(label) as Partial<LocalizedNavigationLabel>;

    if (parsed && typeof parsed === 'object') {
      return {
        en: typeof parsed.en === 'string' ? parsed.en : '',
        ar: typeof parsed.ar === 'string' ? parsed.ar : '',
      };
    }
  } catch {
    // Fall back to a plain-string label stored by newer rows.
  }

  return {
    en: label,
    ar: '',
  };
}

export function serializeNavigationLabel(
  label: LocalizedNavigationLabel,
): string {
  return JSON.stringify({
    en: label.en,
    ar: label.ar,
  });
}

/** Map navigation menu list item from API to view */
export function mapNavigationMenuListItem(
  item: NavigationMenuListItem,
  storeSlug: string,
): NavigationMenuListItemView {
  return {
    id: item.id,
    storeSlug,
    name: item.name,
    handle: item.handle,
    description: item.description,
    itemsCount: item.items_count ?? 0,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

/** Map navigation menu item recursively (handles nested children) */
export function mapNavigationMenuItem(
  item: NavigationMenuItem,
): NavigationMenuItemView {
  const apiItem = item as NavigationMenuItemApi;

  return {
    id: item.id,
    menuId: apiItem.menu_id ?? 0,
    parentId: item.parent_id,
    label: parseNavigationLabel(item.label),
    type: item.type,
    url: item.url,
    resourceId: item.resource_id,
    resourceType: item.resource_type,
    target: item.target,
    settings: item.settings,
    position: item.position,
    isActive: item.is_active,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    children: item.children?.map(mapNavigationMenuItem),
  };
}

/** Map navigation menu detail from API to view */
export function mapNavigationMenuDetail(
  menu: NavigationMenuDetail,
  storeSlug: string,
): NavigationMenuDetailView {
  return {
    id: menu.id,
    storeSlug,
    name: menu.name,
    handle: menu.handle,
    description: menu.description,
    createdAt: menu.created_at,
    updatedAt: menu.updated_at,
    items: (menu.items ?? []).map(mapNavigationMenuItem),
  };
}
