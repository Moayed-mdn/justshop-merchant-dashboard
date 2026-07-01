/**
 * Navigation Menu types for the theme system.
 *
 * Raw types  → exact shape returned by Laravel NavigationMenuResource.
 * View types → mapped shape consumed by UI components.
 */

// ── Raw API types ─────────────────────────────────────────────────────────

export interface LocalizedNavigationLabel {
  en: string;
  ar: string;
}

/** Navigation menu item - raw API shape */
export interface NavigationMenuItem {
  id: number;
  menu_id: number;
  parent_id: number | null;
  label: string;
  type: 'page' | 'category' | 'product' | 'collection' | 'external' | 'custom' | 'link' | 'group';
  url: string;
  resource_id: number | null;
  resource_type: string | null;
  target: '_self' | '_blank';
  settings: Record<string, unknown> | null;
  position: number;
  is_active: boolean;
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
  label: LocalizedNavigationLabel;
  type: NavigationMenuItem['type'];
  url: string;
  resourceId: number | null;
  resourceType: string | null;
  target: '_self' | '_blank';
  settings: Record<string, unknown> | null;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  children?: NavigationMenuItemView[];
}

/** Navigation menu list item - mapped for UI */
export interface NavigationMenuListItemView {
  id: number;
  storeSlug: string;
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
  storeSlug: string;
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
  label: string;
  type: NavigationMenuItem['type'];
  url: string;
  resource_id?: number | null;
  resource_type?: string | null;
  target: '_self' | '_blank';
  settings?: Record<string, unknown> | null;
  position: number;
  is_active: boolean;
}

/** Payload sent to PATCH /navigation/:menuId/items/:itemId */
export interface UpdateMenuItemPayload {
  parent_id: number | null;
  label: string;
  type: NavigationMenuItem['type'];
  url: string;
  resource_id?: number | null;
  resource_type?: string | null;
  target: '_self' | '_blank';
  settings?: Record<string, unknown> | null;
  position: number;
  is_active: boolean;
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
