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
  color_schemes?: {
    [key: string]: ColorScheme;
  };
  fonts?: {
    heading?: string;
    body?: string;
  };
  layout?: {
    containerWidth?: string;
    borderRadius?: string;
  };
  buttons?: {
    primary?: ButtonSettings;
    secondary?: ButtonSettings;
    outline?: ButtonSettings;
  };
  [key: string]: unknown;
}

/** Color Scheme - Shopify-style coordinated color set */
export interface ColorScheme {
  name: string;
  background: string;
  text: string;
  button_background: string;
  button_text: string;
  secondary_background: string;
  border: string;
}

/** Button configuration for theme */
export interface ButtonSettings {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  paddingX: 'sm' | 'md' | 'lg' | 'xl';
  paddingY: 'sm' | 'md' | 'lg';
  fontSize: 'sm' | 'base' | 'lg';
  fontWeight: 'normal' | 'medium' | 'semibold' | 'bold';
  hoverEffect: 'opacity' | 'darken' | 'lift' | 'scale';
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

// ── Page Template types ───────────────────────────────────────────────────

/** Page Template - raw API shape */
export interface PageTemplate {
  id: number;
  store_id: number;
  name: string;
  handle: string;
  type: string;
  description: string | null;
  sections: Record<string, PageTemplateSection>;
  section_order: string[];
  section_settings: Record<string, unknown>;
  is_default: boolean;
  is_active: boolean;
  pages_count?: number;
  created_by: number | null;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
}

/** Page Template section config */
export interface PageTemplateSection {
  type: string;
  settings: Record<string, unknown>;
}

/** Page Template - view type for UI consumption */
export interface PageTemplateView {
  id: number;
  storeId: number;
  name: string;
  handle: string;
  type: string;
  description: string | null;
  sections: Record<string, PageTemplateSection>;
  sectionOrder: string[];
  sectionSettings: Record<string, unknown>;
  isDefault: boolean;
  isActive: boolean;
  pagesCount: number;
  createdAt: string;
  updatedAt: string;
}

/** Create page template payload */
export interface CreatePageTemplatePayload {
  name: string;
  handle: string;
  type: string;
  description?: string | null;
  sections?: Record<string, PageTemplateSection>;
  section_order?: string[];
  section_settings?: Record<string, unknown>;
}

/** Update page template payload */
export interface UpdatePageTemplatePayload {
  name?: string;
  handle?: string;
  type?: string;
  description?: string | null;
  sections?: Record<string, PageTemplateSection>;
  section_order?: string[];
  section_settings?: Record<string, unknown>;
  is_default?: boolean;
  is_active?: boolean;
}

/** Duplicate page template payload */
export interface DuplicatePageTemplatePayload {
  name: string;
}

// ── Section Schema types ───────────────────────────────────────────────────

/** Section schema setting definition from the backend */
export interface SectionSchemaSetting {
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'number' | 'link_list' | 'color' | 'image_picker';
  id: string;
  label: string;
  default?: unknown;
  options?: { value: string; label: string; }[];
  info?: string;
  min?: number;
  max?: number;
  placeholder?: string;
}

/** Section schema - raw API shape from SectionSchemaResource */
export interface SectionSchema {
  id: number;
  type: string;
  name: string;
  description: string | null;
  category: string;
  settings: SectionSchemaSetting[];
  blocks: Record<string, unknown>[] | null;
  presets: Record<string, unknown>[] | null;
  is_active: boolean;
  sort_order: number;
}

/** Section schema grouped by category for UI */
export interface SectionSchemaGroup {
  category: string;
  schemas: SectionSchema[];
}

// ── Font options ──────────────────────────────────────────────────────────

export interface FontOption {
  name: string;
  value: string;
  category: 'serif' | 'sans-serif' | 'display' | 'monospace';
}
