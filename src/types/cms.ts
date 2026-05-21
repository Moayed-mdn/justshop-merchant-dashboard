/**
 * CMS SEO Contract (LOCKED)
 */
export interface SeoPayload {
  meta_title: string;
  meta_description: string;
  canonical_url: string;
  alternates: {
    en: string;
    ar: string;
    'x-default': string;
  };
  robots: {
    index: boolean;
    follow: boolean;
    all: string;
  };
  og: {
    title: string;
    description: string;
    image: string;
    type: 'website' | 'article';
  };
  twitter: {
    card: 'summary_large_image' | 'summary';
    title: string;
    description: string;
    image: string;
  };
  structured_data: Record<string, unknown>;
}

/**
 * Base CMS Content Interface
 */
export interface CmsBaseContent {
  id: string;
  slug: string;
  title: string;
  content: string;
  seo: SeoPayload;
  published_at: string;
  updated_at: string;
}

/**
 * Marketing Page Type
 */
export interface MarketingPage extends CmsBaseContent {
  layout?: string;
  blocks?: Array<{
    type: string;
    data: Record<string, unknown>;
  }>;
}

/**
 * Blog Post Type
 */
export interface BlogPost extends CmsBaseContent {
  excerpt: string;
  author: {
    name: string;
    avatar?: string;
  };
  category: {
    name: string;
    slug: string;
  };
  featured_image: string;
}

/**
 * Blog Post Collection Type
 */
export interface BlogPostCollection {
  posts: BlogPost[];
  total: number;
}

/**
 * Documentation Page Type
 */
export interface DocumentationPage extends CmsBaseContent {
  parent_id?: string;
  order: number;
  slug_path: string;
}

/**
 * Documentation Sidebar Node
 */
export interface DocumentationSidebarNode {
  id: string;
  title: string;
  slug: string;
  slug_path: string;
  children: DocumentationSidebarNode[];
}

/**
 * Documentation Sidebar Type
 */
export interface DocumentationSidebar {
  items: DocumentationSidebarNode[];
}

/**
 * Sitemap Entry
 */
export interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}
