/**
 * Navigation Menu types for the theme system.
 *
 * Raw types  → exact shape returned by Laravel NavigationMenuResource.
 * View types → mapped shape consumed by UI components.
 */

// ── Raw API types ─────────────────────────────────────────────────────────

/** Navigation menu item - raw API shape */
export interface NavigationMenuItem {
  id: number;
  navigation_menu_id: number;
  parent_id: number | null;
  label: Record<string, string>; // {"en": "Home", "ar": "الرئيسية"}
  url: string;
  target: '_self' | '_blank';
  position: number;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
  children?: NavigationMenuItem[]; // Nested children
}

/** Navigation menu list item - raw API shape */
export interface NavigationMenuListItem {
  id: number;
  store_id: number;
  name: string;
  handle: string;
  description: string | null;
  items_count: number;
  created_at: string;
  updated_at: string;
}

/** Navigation menu detail - raw API shape */
export interface NavigationMenuDetail {
  id: number;
  store_id: number;
  name: string;
  handle: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  items: NavigationMenuItem[]; // Root level items (parent_id = null)
}

// ── View types ────────────────────────────────────────────────────────────

/** Navigation menu item - mapped for UI consumption */
export interface NavigationMenuItemView {
  id: number;
  menuId: number;
  parentId: number | null;
  label: Record<string, string>;
  url: string;
  target: '_self' | '_blank';
  position: number;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  children?: NavigationMenuItemView[];
}

/** Navigation menu list item - mapped for UI */
export interface NavigationMenuListItemView {
  id: number;
  storeId: number;
  name: string;
  handle: string;
  description: string | null;
  itemsCount: number;
  createdAt: string;
  updatedAt: string;
}

/** Navigation menu detail - mapped for UI */
export interface NavigationMenuDetailView {
  id: number;
  storeId: number;
  name: string;
  handle: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  items: NavigationMenuItemView[];
}

// ── Form types ────────────────────────────────────────────────────────────

/** Payload sent to POST /navigation */
export interface CreateNavigationMenuPayload {
  name: string;
  handle: string;
  description: string | null;
}

/** Payload sent to PATCH /navigation/:id */
export interface UpdateNavigationMenuPayload {
  name: string;
  handle: string;
  description: string | null;
}

/** Payload sent to POST /navigation/:menuId/items */
export interface CreateMenuItemPayload {
  parent_id: number | null;
  label: Record<string, string>; // {"en": "Home", "ar": "الرئيسية"}
  url: string;
  target: '_self' | '_blank';
  position: number;
  is_enabled: boolean;
}

/** Payload sent to PATCH /navigation/:menuId/items/:itemId */
export interface UpdateMenuItemPayload {
  parent_id: number | null;
  label: Record<string, string>;
  url: string;
  target: '_self' | '_blank';
  position: number;
  is_enabled: boolean;
}

/** Payload sent to POST /navigation/:menuId/items/reorder */
export interface ReorderMenuItemsPayload {
  items: Array<{
    id: number;
    position: number;
    parent_id: number | null;
  }>;
}

// ── Filter types ──────────────────────────────────────────────────────────

export interface NavigationMenuFilters {
  page: number;
  perPage: number;
}
