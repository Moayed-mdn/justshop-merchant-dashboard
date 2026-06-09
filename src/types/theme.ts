/**
 * Theme types for the theme system.
 *
 * Raw types  → exact shape returned by Laravel ThemeResource.
 * View types → mapped shape consumed by UI components.
 */

// ── Raw API types ─────────────────────────────────────────────────────────

/** Theme status */
export type ThemeStatus = 'draft' | 'published';

/** Theme settings structure */
export interface ThemeSettings {
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };
  fonts?: {
    heading?: string;
    body?: string;
  };
  layout?: {
    containerWidth?: string;
    borderRadius?: string;
  };
  [key: string]: unknown;
}

/** Theme - raw API shape */
export interface Theme {
  id: number;
  store_id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  is_published: boolean;
  settings: ThemeSettings;
  created_at: string;
  updated_at: string;
}

/** Theme list item - raw API shape */
export interface ThemeListItem {
  id: number;
  store_id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  is_published: boolean;
  sections_count?: number;
  created_at: string;
  updated_at: string;
}

// ── View types ────────────────────────────────────────────────────────────

/** Theme - mapped for UI consumption */
export interface ThemeView {
  id: number;
  storeId: number;
  name: string;
  description: string | null;
  isActive: boolean;
  isPublished: boolean;
  settings: ThemeSettings;
  createdAt: string;
  updatedAt: string;
}

/** Theme list item - mapped for UI */
export interface ThemeListItemView {
  id: number;
  storeId: number;
  name: string;
  description: string | null;
  isActive: boolean;
  isPublished: boolean;
  settings?: ThemeSettings;
  sectionsCount?: number;
  createdAt: string;
  updatedAt: string;
}

// ── Form types ────────────────────────────────────────────────────────────

/** Payload sent to POST /themes */
export interface CreateThemePayload {
  name: string;
  description: string | null;
  settings?: ThemeSettings;
}

/** Payload sent to PATCH /themes/:id */
export interface UpdateThemePayload {
  name?: string;
  description?: string | null;
  settings?: ThemeSettings;
}

/** Payload sent to POST /themes/:id/publish */
export interface PublishThemePayload {
  // Empty - just triggers publish action
}

/** Payload sent to POST /themes/:id/duplicate */
export interface DuplicateThemePayload {
  name: string;
}

// ── Filter types ──────────────────────────────────────────────────────────

export interface ThemeFilters {
  page: number;
  perPage: number;
  status?: 'all' | 'draft' | 'published';
}

// ── Settings form types ───────────────────────────────────────────────────

export interface ThemeColorSettings {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface ThemeFontSettings {
  heading: string;
  body: string;
}

export interface ThemeLayoutSettings {
  containerWidth: string;
  borderRadius: string;
}

// ── Font options ──────────────────────────────────────────────────────────

export interface FontOption {
  name: string;
  value: string;
  category: 'serif' | 'sans-serif' | 'display' | 'monospace';
}
