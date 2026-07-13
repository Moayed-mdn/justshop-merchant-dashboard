/**
 * Theme types for the theme system.
 *
 * Raw types  → exact shape returned by Laravel ThemeResource.
 * View types → mapped shape consumed by UI components.
 *
 * These types MUST stay in sync with the backend PHP enums and DTOs.
 * Backend source of truth: app/Enums/Theme/ and app/Models/Theme/
 */

// ── Template Type Enum (mirrors App\Enums\Theme\TemplateTypeEnum) ─────────

export const TEMPLATE_TYPE_LABELS: Record<string, string> = {
  home: 'Home Page',
  product: 'Product Page',
  category: 'Category Page',
  collection: 'Collection Page',
  page: 'Static Page',
  cart: 'Shopping Cart',
  checkout: 'Checkout',
  checkout_success: 'Checkout Success',
  checkout_cancel: 'Checkout Cancelled',
  search: 'Search Results',
  login: 'Login Page',
  register: 'Register Page',
  forgot_password: 'Forgot Password',
  reset_password: 'Reset Password',
  verify_email: 'Verify Email',
  account: 'Account / Profile Page',
  orders: 'Order History',
  order: 'Order Detail',
  order_track: 'Order Tracking',
  categories: 'All Categories',
  blog: 'Blog Index',
  blog_post: 'Blog Post',
  error_404: '404 Not Found',
  error_500: '500 Server Error',
  header_group: 'Header Section Group',
  footer_group: 'Footer Section Group',
  custom: 'Custom Template',
};

export function getTemplateTypeLabel(type: string): string {
  return TEMPLATE_TYPE_LABELS[type] ?? type;
}

export function isSystemPageType(type: string): boolean {
  return !['page', 'home', 'custom'].includes(type);
}

export function isSectionGroupType(type: string): boolean {
  return ['header_group', 'footer_group'].includes(type);
}

// ── Section Type Enum (mirrors App\Enums\Theme\SectionTypeEnum) ─────────

export const SECTION_TYPE_CATEGORIES: Record<string, string> = {
  layout: 'Layout',
  content: 'Content',
  commerce: 'Commerce',
  system: 'System Pages',
  custom: 'Custom',
};

// ── Block Type Enum (mirrors App\Enums\Theme\BlockTypeEnum) ─────────────

export const BLOCK_TYPE_LABELS: Record<string, string> = {
  logo: 'Logo',
  navigation: 'Navigation Menu',
  search: 'Search Bar',
  cart: 'Shopping Cart',
  language_selector: 'Language Selector',
  social_links: 'Social Media Links',
  copyright: 'Copyright Notice',
  payment_icons: 'Payment Icons',
  text: 'Text Block',
  image: 'Image',
  button: 'Button',
  html: 'Custom HTML',
  spacer: 'Spacer',
  divider: 'Divider',
  link: 'Link',
  link_group: 'Link Group',
  product_list: 'Product List',
  category_list: 'Category List',
  feature: 'Feature',
  testimonial: 'Testimonial',
  gallery_item: 'Gallery Item',
  pricing_plan: 'Pricing Plan',
  faq_item: 'FAQ Item',
  slide: 'Slide',
  stat: 'Stat',
  promise: 'Promise',
  metric: 'Metric',
  trust_badge: 'Trust Badge',
  custom: 'Custom Block',
};

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
    text_muted?: string;
    border?: string;
    success?: string;
    error?: string;
    warning?: string;
  };
  color_schemes?: {
    [key: string]: ColorScheme;
  };
  fonts?: {
    heading?: string;
    body?: string;
  };
  typography?: {
    heading_weight?: string;
    body_weight?: string;
    base_font_size?: string;
    line_height?: string;
    letter_spacing?: string;
  };
  layout?: {
    container_width?: 'boxed' | 'full_width';
    page_width?: string;
    border_radius?: string;
    direction?: 'ltr' | 'rtl';
  };
  buttons?: {
    primary?: ButtonSettings;
    secondary?: ButtonSettings;
    outline?: ButtonSettings;
  };
  branding?: {
    logo_url?: string | null;
    favicon_url?: string | null;
    store_name?: string;
    tagline?: string;
  };
  social?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    linkedin?: string;
    pinterest?: string;
  };
  announcement_bar?: {
    enabled?: boolean;
    text?: string;
    phone?: string;
    offer_text?: string;
    shop_now_text?: string;
    shop_now_link?: string;
    show_language_switcher?: boolean;
    dismissible?: boolean;
    bg_color?: string;
    text_color?: string;
  };
  footer?: {
    show_newsletter?: boolean;
    copyright_text?: string;
    payment_icons?: string[];
  };
  seo?: {
    default_title?: string;
    default_description?: string;
    default_og_image?: string;
  };
  search?: {
    placeholder?: string;
    show_suggestions?: boolean;
    products_per_page?: number;
  };
  maintenance?: {
    enabled?: boolean;
    message?: string;
  };
  custom_css?: string;
  custom_js?: string;
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
  slug: string | null;
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
  slug: string | null;
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
  storeSlug: string;
  name: string;
  slug: string | null;
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
  storeSlug: string;
  name: string;
  slug: string | null;
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
  storeSlug: string;
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
  sections: Record<string, PageTemplateSection>;
  section_order: string[];
  section_settings?: Record<string, unknown>;
  is_default?: boolean;
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

// ── System Template types (ThemeTemplate) ────────────────────────────────────

/** SystemTemplate - raw API type for ThemeTemplate managed via SystemTemplateController */
export interface SystemTemplate {
  id: number;
  theme_id: number;
  theme_slug: string;
  theme_identifier: string;
  name: string;
  handle: string;
  type: string;
  type_label: string;
  description: string | null;
  settings: Record<string, unknown>;
  is_default: boolean;
  sections: SystemTemplateSection[];
  created_at: string;
  updated_at: string;
}

export interface SystemTemplateSection {
  id: number;
  section_type: string;
  position: number;
  overrides: Record<string, unknown>;
  settings: Record<string, unknown>;
  is_visible: boolean;
  blocks: ThemeBlock[];
}

/** SystemTemplateView - camelCase view type for UI consumption */
export interface SystemTemplateView {
  id: number;
  themeId: number;
  themeSlug: string;
  themeIdentifier: string;
  name: string;
  handle: string;
  type: string;
  typeLabel: string;
  description: string | null;
  settings: Record<string, unknown>;
  isDefault: boolean;
  sections: SystemTemplateSectionView[];
  createdAt: string;
  updatedAt: string;
}

export interface SystemTemplateSectionView {
  id: number;
  sectionType: string;
  position: number;
  overrides: Record<string, unknown>;
  settings: Record<string, unknown>;
  isVisible: boolean;
  blocks: ThemeBlock[];
}

/** Update system template payload */
export interface UpdateSystemTemplatePayload {
  name?: string;
  description?: string | null;
  section_ids?: number[];
  section_overrides?: Record<string, Record<string, unknown>>;
  section_visibility?: Record<string, boolean>;
  settings?: Record<string, unknown>;
  is_default?: boolean;
}

// ── Section Schema types ───────────────────────────────────────────────────

/** Section schema setting type - all supported setting types */
export type SettingType =
  | 'text' | 'localized_text' | 'textarea' | 'richtext' | 'number' | 'checkbox'
  | 'select' | 'color' | 'image_picker' | 'url' | 'link_list'
  | 'range' | 'header' | 'paragraph';

/** Section schema setting definition from the backend */
export interface SectionSchemaSetting {
  type: SettingType;
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

// ── Section Schema types (expanded) ────────────────────────────────────────

/** Block definition within a section schema */
export interface SectionSchemaBlockDefinition {
  type: string;
  name: string;
  limit?: number;
  settings: SectionSchemaSetting[];
}

/** Section schema preset */
export interface SectionSchemaPreset {
  name: string;
  category?: string;
  settings?: Record<string, unknown>;
  blocks?: Array<{
    type: string;
    name?: string;
    settings?: Record<string, unknown>;
  }>;
}

// ── Theme Section Group types ──────────────────────────────────────────────

export interface ThemeSectionGroup {
  id: number;
  theme_id: number;
  theme_slug: string;
  theme_identifier: string;
  name: string;
  handle: string;
  sections: Record<string, { type: string; settings: Record<string, unknown> }>;
  order: string[];
  created_at: string;
  updated_at: string;
}

export interface ThemeSectionGroupView {
  id: number;
  themeId: number;
  themeSlug: string;
  themeIdentifier: string;
  name: string;
  handle: string;
  sections: Record<string, { type: string; settings: Record<string, unknown> }>;
  order: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSectionGroupPayload {
  sections: Record<string, { type: string; settings: Record<string, unknown> }>;
  order: string[];
}

/** ThemeBlock - section-level block definition (returned alongside system template sections) */
export interface ThemeBlock {
  id: number;
  section_id?: number;
  type: string;
  name: string;
  handle?: string;
  description?: string;
  settings: Record<string, unknown>;
  content?: Record<string, unknown>;
  position: number;
  is_enabled: boolean;
  is_removable?: boolean;
}

/** ThemeBlock view type */
export interface ThemeBlockView {
  id: number;
  sectionId?: number;
  type: string;
  name: string;
  handle?: string;
  description?: string;
  settings: Record<string, unknown>;
  content?: Record<string, unknown>;
  position: number;
  isEnabled: boolean;
  isRemovable?: boolean;
}

/** Block manager state for UI */
export interface BlockManagerState {
  editingBlockId: number | null;
  showAddBlock: boolean;
}

// ── Theme Block Instance types ─────────────────────────────────────────────

export interface ThemeBlockInstance {
  id: number;
  container_type: string;
  container_id: number;
  type: string;
  name: string | null;
  settings: Record<string, unknown>;
  content: Record<string, unknown> | null;
  position: number;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface ThemeBlockInstanceView {
  id: number;
  containerType: string;
  containerId: number;
  type: string;
  name: string | null;
  settings: Record<string, unknown>;
  content: Record<string, unknown> | null;
  position: number;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlockInstancePayload {
  type: string;
  name?: string;
  settings?: Record<string, unknown>;
  content?: Record<string, unknown>;
  position?: number;
}

// ── Font options ──────────────────────────────────────────────────────────

export interface FontOption {
  name: string;
  value: string;
  category: 'serif' | 'sans-serif' | 'display' | 'monospace';
}
