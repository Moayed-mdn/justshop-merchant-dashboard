/**
 * Navigation menu data mappers.
 * Transforms snake_case API responses to camelCase view types.
 */

import type {
  NavigationMenuListItem,
  NavigationMenuListItemView,
  NavigationMenuDetail,
  NavigationMenuDetailView,
  NavigationMenuItem,
  NavigationMenuItemView,
} from '@/types/navigation';

/** Map navigation menu list item from API to view */
export function mapNavigationMenuListItem(
  item: NavigationMenuListItem,
): NavigationMenuListItemView {
  return {
    id: item.id,
    storeId: item.store_id,
    name: item.name,
    handle: item.handle,
    description: item.description,
    itemsCount: item.items_count,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

/** Map navigation menu item recursively (handles nested children) */
export function mapNavigationMenuItem(
  item: NavigationMenuItem,
): NavigationMenuItemView {
  return {
    id: item.id,
    menuId: item.navigation_menu_id,
    parentId: item.parent_id,
    label: item.label,
    url: item.url,
    target: item.target,
    position: item.position,
    isEnabled: item.is_enabled,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    children: item.children?.map(mapNavigationMenuItem),
  };
}

/** Map navigation menu detail from API to view */
export function mapNavigationMenuDetail(
  menu: NavigationMenuDetail,
): NavigationMenuDetailView {
  return {
    id: menu.id,
    storeId: menu.store_id,
    name: menu.name,
    handle: menu.handle,
    description: menu.description,
    createdAt: menu.created_at,
    updatedAt: menu.updated_at,
    items: menu.items.map(mapNavigationMenuItem),
  };
}
