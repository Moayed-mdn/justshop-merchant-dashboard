/**
 * Runtime API types for the storefront.
 *
 * These match the exact shape returned by the Storefront Runtime API
 * (StorefrontRuntimeController + RuntimeResponseFactory).
 */

// ── Response Envelope ───────────────────────────────────────────────────────

export interface RuntimeRequestContext {
  requestId: string;
  tenantId: string | null;
  tenantKey: string | null;
  locale: string;
  path: string;
  runtimeVersion: string;
  preview: boolean;
}

export interface RuntimeCacheInfo {
  key: string;
  artifact: string;
  ttlSeconds: number;
  tags: string[];
  bypassed: boolean;
}

export interface RuntimeError {
  code: string;
  message: string;
  httpStatus: number;
  retryable: boolean;
  details?: Record<string, unknown>;
}

export interface RuntimeResponse<T> {
  requestContext: RuntimeRequestContext;
  data?: T;
  error?: RuntimeError;
  cache: RuntimeCacheInfo;
}

// ── Route Resolution ────────────────────────────────────────────────────────

export type RouteType = 'home' | 'shop_page' | 'category_page' | 'product_page' | 'marketing_page';
export type LayoutType = 'marketing' | 'default' | 'catalog' | 'product';

export interface RouteResolution {
  status: 'matched' | 'not_found';
  routeType: RouteType;
  pageId: string | null;
  resourceType: string;
  resourceId: string | null;
  path: string;
  locale: string;
  layout: LayoutType | null;
  legacyPassthrough: boolean;
}

// ── Navigation ──────────────────────────────────────────────────────────────

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  external: boolean;
  children: NavigationItem[];
}

export interface NavigationPayload {
  header: NavigationItem[];
  footer: NavigationItem[];
}

// ── Theme ───────────────────────────────────────────────────────────────────

export interface RuntimeThemeBranding {
  storeName: string;
  tagline: string;
}

export interface RuntimeThemeTokens {
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  colorSurface: string;
  colorText: string;
  fontBody: string;
  fontHeading: string;
}

export interface RuntimeThemeAssets {
  logoUrl: string | null;
  faviconUrl: string | null;
}

export interface RuntimeThemeSettings {
  radius: string;
  direction: 'ltr' | 'rtl';
  colors?: Record<string, unknown>;
  color_schemes?: Record<string, unknown>;
  typography?: Record<string, unknown>;
  buttons?: Record<string, unknown>;
}

export interface RuntimeThemePayload {
  themeKey: string;
  name: string;
  version: string;
  branding: RuntimeThemeBranding;
  tokens: RuntimeThemeTokens;
  assets: RuntimeThemeAssets;
  settings: RuntimeThemeSettings;
}

// ── Sections ────────────────────────────────────────────────────────────────

export type SectionDataState = 'ready' | 'empty' | 'loading' | 'error';

export interface RuntimeSection {
  id: string;
  type: string;
  component: string;
  props: Record<string, unknown>;
  version: string;
  dataState: SectionDataState;
}

export interface PageTemplateInfo {
  id: number;
  handle: string;
  sections: Record<string, { type: string; settings: Record<string, unknown> }>;
  sectionOrder: string[];
}

// ── SEO ─────────────────────────────────────────────────────────────────────

export interface SeoHreflang {
  locale: string;
  url: string;
}

export interface SeoPayload {
  title: string;
  description: string;
  canonicalUrl: string;
  robots: string;
  hreflang: SeoHreflang[];
  openGraph: {
    title: string;
    description: string;
    type: string;
    imageUrl: string | null;
  } | null;
  twitter: {
    card: string;
    title: string;
    description: string;
    imageUrl: string | null;
  } | null;
  jsonLd: Record<string, unknown>[];
}

// ── Page Payload ────────────────────────────────────────────────────────────

export interface RuntimePagePayload {
  id: string;
  pageType: RouteType;
  title: string;
  slug: string;
  locale: string;
  layout: string;
  status: string;
  sections: RuntimeSection[];
  template?: PageTemplateInfo;
  seo?: SeoPayload;
  publishedAt: string | null;
  updatedAt: string;
}

export interface RuntimePageData {
  page: RuntimePagePayload;
}

// ── Section Component Props ─────────────────────────────────────────────────

export interface HeaderSectionProps {
  menu?: NavigationItem[];
  logoUrl?: string | null;
  storeName?: string;
  settings?: Record<string, unknown>;
}

export interface FooterSectionProps {
  menu?: NavigationItem[];
  storeName?: string;
  copyrightYear?: number;
  showSocial?: boolean;
  settings?: Record<string, unknown>;
}

export interface PageContentSectionProps {
  title?: string;
  content?: string;
  settings?: Record<string, unknown>;
}

export interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  items?: { heading?: string; text?: string; image_url?: string }[];
  content?: { heading?: string; text?: string; image_url?: string };
  settings?: Record<string, unknown>;
}

export interface ContentSectionProps {
  title?: string;
  subtitle?: string;
  content?: string;
  settings?: Record<string, unknown>;
}

export interface CtaSectionProps {
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
  buttonUrl?: string;
  settings?: Record<string, unknown>;
}

export interface ProductGridSectionProps {
  title?: string;
  subtitle?: string;
  products?: Record<string, unknown>[];
  settings?: Record<string, unknown>;
}

export interface CategoryGridSectionProps {
  title?: string;
  subtitle?: string;
  categories?: Record<string, unknown>[];
  settings?: Record<string, unknown>;
}
