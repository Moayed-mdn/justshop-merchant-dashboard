/**
 * Marketing Page types for the merchant dashboard.
 *
 * Raw types  → exact shape returned by the backend API.
 * View types → mapped shape consumed by UI components.
 * Payload types → shapes sent to create/update endpoints.
 */

// ── Primitives ────────────────────────────────────────────────────────────

export type MarketingPageTemplate = 'landing' | 'campaign' | 'promotion' | 'generic';
export type MarketingPageStatus   = 'draft' | 'published' | 'scheduled';

// ── Localized field ───────────────────────────────────────────────────────

/** Locale-keyed string object, e.g. { en: "Summer Sale", ar: "تخفيضات الصيف" } */
export type LocalizedString = Record<string, string>;

// ── SEO ───────────────────────────────────────────────────────────────────

export interface MarketingPageSeo {
  meta_title:       LocalizedString;
  meta_description: LocalizedString;
  canonical_url:    string;
  robots:           string;
  og_image:         string;
}

// ── Section ───────────────────────────────────────────────────────────────

export interface MarketingPageSection {
  type:       string;
  identifier: string;
  title:      LocalizedString;
  subtitle:   LocalizedString;
  content:    LocalizedString | Record<string, unknown>;
  settings:   Record<string, unknown>;
  is_active:  boolean;
}

// ── Section type option (from API) ────────────────────────────────────

export interface SectionTypeOption {
  value: string;
  label: string;
}

// ── Raw API types ─────────────────────────────────────────────────────────

/** Marketing page list item — raw API shape */
export interface MarketingPageListItem {
  id:           number;
  store_id:     number;
  title:        LocalizedString;
  slug:         LocalizedString;
  excerpt:      LocalizedString;
  template:     MarketingPageTemplate;
  status:       MarketingPageStatus;
  published_at: string | null;
  sort_order:   number;
  seo:          MarketingPageSeo | null;
  sections:     MarketingPageSection[];
  created_at:   string;
  updated_at:   string;
}

/** Marketing page detail — same shape as list item for this API */
export type MarketingPageDetail = MarketingPageListItem;

// ── View types ────────────────────────────────────────────────────────────

/** Marketing page list item — mapped for UI consumption */
export interface MarketingPageListItemView {
  id:          number;
  storeId:     number;
  title:       LocalizedString;
  slug:        LocalizedString;
  template:    MarketingPageTemplate;
  status:      MarketingPageStatus;
  publishedAt: string | null;
  sortOrder:   number;
  /** Resolved display title (en fallback) */
  displayTitle: string;
  createdAt:   string;
  updatedAt:   string;
}

/** Marketing page detail — mapped for UI consumption */
export interface MarketingPageDetailView {
  id:          number;
  storeId:     number;
  title:       LocalizedString;
  slug:        LocalizedString;
  excerpt:     LocalizedString;
  template:    MarketingPageTemplate;
  status:      MarketingPageStatus;
  publishedAt: string | null;
  sortOrder:   number;
  isHomepage:  boolean;
  seo:         MarketingPageSeo;
  sections:    MarketingPageSection[];
  createdAt:   string;
  updatedAt:   string;
}

// ── Payload types ─────────────────────────────────────────────────────────

export interface CreateMarketingPagePayload {
  title:        LocalizedString;
  slug:         LocalizedString;
  excerpt:      LocalizedString;
  template:     MarketingPageTemplate;
  status:       MarketingPageStatus;
  published_at: string | null;
  sort_order:   number;
  is_homepage:  boolean;
  seo:          MarketingPageSeo;
  sections:     MarketingPageSection[];
}

export type UpdateMarketingPagePayload = CreateMarketingPagePayload;

// ── Filter types ──────────────────────────────────────────────────────────

export interface MarketingPageFilters {
  search:   string;
  status:   'all' | MarketingPageStatus;
  template: 'all' | MarketingPageTemplate;
  page:     number;
  perPage:  number;
}
