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
  id: number | string;
  slug: string;
  title: string;
  content?: string;
  seo: SeoPayload;
  updated_at: string;
  published_at?: string;
}

/**
 * CMS Section Interfaces (LOCKED)
 * These match the Laravel CMS backend contract exactly.
 */

export interface CmsHeroSection {
  title: string;
  subtitle: string;
  cta_primary: string | { label: string; url: string } | null;
  cta_secondary: string | { label: string; url: string } | null;
  badge: string | null;
  image: string | null;
}

export interface CmsCtaSection {
  title: string;
  subtitle: string;
  primary_label: string;
  secondary_label: string;
  primary_url: string;
  secondary_url: string;
}

export interface CmsCompanyInfoSection {
  email: string;
  phone: string;
  address: string;
  hours: string;
  map_url: string | null;
}

export interface CmsFooterSection {
  copyright: string;
  tagline: string;
  links: Array<{
    label: string;
    url: string;
  }>;
}

export interface CmsStatItem {
  id: string | number;
  label: string;
  value: string;
  description?: string;
}

export interface CmsFaqItem {
  id: string | number;
  question: string;
  answer: string;
}

export interface CmsTestimonialItem {
  id: string | number;
  quote: string;
  author: string;
  role: string;
  avatar: string | null;
}

export interface CmsSocialLink {
  platform: string;
  url: string;
}

export interface CmsPricingPlan {
  name: string;
  price_monthly: string;
  price_yearly: string;
  features: string[];
  limits: string;
  cta: string;
  featured?: boolean;
}

export interface CmsComparisonTable {
  headers: string[];
  rows: string[][];
}

export interface CmsFeatureItem {
  title: string;
  desc: string;
}

export interface CmsFeatureGroup {
  title: string;
  features: CmsFeatureItem[];
}

export interface CmsIntegration {
  name: string;
  logo: string;
}

export interface CmsSimpleSection {
  title: string;
  desc: string;
}

export interface CmsComplianceSection {
  title: string;
  badges: string[];
}

export interface CmsEnterpriseHighlight {
  title: string;
  content: string;
}

export interface CmsCaseStudy {
  client: string;
  result: string;
}

export interface CmsCategory {
  title: string;
  desc: string;
}

export interface CmsProductWalkthroughSection {
  heading: string;
  steps: Array<{
    title: string;
    description: string;
    image: string;
  }>;
}

export interface CmsTemplateShowcaseSection {
  heading: string;
  subtitle: string;
  templates: Array<{
    id: string;
    name: string;
    thumbnail: string;
    demo_url: string;
    category: string;
  }>;
}

export interface CmsIndustryUseCase {
  industry: string;
  description: string;
  icon: string;
}

export interface CmsPerformanceMetricsSection {
  heading: string;
  metrics: Array<{
    label: string;
    value: string;
    subtext: string;
  }>;
}

export interface CmsContactMethod {
  type: 'email' | 'phone' | 'address';
  label: string;
  value: string;
}

export interface CmsOfficeLocation {
  city: string;
  address: string;
}

export interface CmsSupportHours {
  days: string;
  hours: string;
}

export interface CmsLogoItem {
  name: string;
  src: string;
  width: number;
  height: number;
}

export interface CmsWorkflowStep {
  id?: string | number;
  title: string;
  description: string;
}

export interface CmsHighlightItem {
  id?: string | number;
  title: string;
  description: string;
  icon?: string;
}

export interface CmsActionCardItem {
  id?: string | number;
  icon: string;
  title: string;
  description: string;
  url: string;
  cta_label: string;
}

export interface CmsSections {
  hero?: CmsHeroSection;
  stats?: CmsStatItem[];
  faq?: CmsFaqItem[];
  testimonials?: CmsTestimonialItem[];
  cta?: CmsCtaSection;
  plans?: CmsPricingPlan[];
  comparison_table?: CmsComparisonTable;
  feature_groups?: CmsFeatureGroup[];
  integrations?: CmsIntegration[];
  automation?: CmsSimpleSection;
  analytics?: CmsSimpleSection;
  mobile?: CmsSimpleSection;
  security?: CmsSimpleSection;
  // Demo Specific
  product_walkthrough?: CmsProductWalkthroughSection;
  dashboard_preview?: { heading: string; subtext: string; image: string };
  automation_features?: CmsSimpleSection;
  analytics_preview?: CmsSimpleSection;
  // Templates Specific
  template_categories?: CmsCategory[];
  featured_templates?: CmsTemplateShowcaseSection;
  industry_use_cases?: CmsIndustryUseCase[];
  customization_features?: CmsSimpleSection;
  storefront_capabilities?: CmsSimpleSection;
  mobile_experience?: CmsSimpleSection;
   performance_features?: CmsPerformanceMetricsSection;
   // Contact Specific
   contact_methods?: CmsContactMethod[];
   office_locations?: CmsOfficeLocation[];
   support_hours?: CmsSupportHours[];
   // Enterprise specific
   enterprise_features?: CmsFeatureItem[];
  compliance?: CmsComplianceSection;
  scalability?: CmsEnterpriseHighlight;
  infrastructure?: CmsEnterpriseHighlight;
  support?: CmsEnterpriseHighlight;
  case_studies?: CmsCaseStudy[];
  // Docs & Blog specific
  categories?: string[] | CmsCategory[];
  company_info?: CmsCompanyInfoSection;
  footer?: CmsFooterSection;
  social_links?: CmsSocialLink[];
  // Generic section types to avoid cast errors in renderer
  logos?: { label?: string; items?: CmsLogoItem[] };
  features?: { heading: string; eyebrow?: string; subtitle?: string; items?: CmsFeatureItem[] };
  showcase?: { heading: string; subtext: string; image?: string; cta?: string | { label: string; url: string } };
  workflow?: { heading: string; steps?: CmsWorkflowStep[] };
  detail_grid?: { heading: string; items?: CmsHighlightItem[] };
  action_cards?: { heading: string; items?: CmsActionCardItem[] };
  [key: string]: unknown;
}

/**
 * Marketing Page Type (LOCKED)
 */
export interface MarketingPage extends CmsBaseContent {
  type: 'marketing_page';
  page_type: string;
  locale: string;
  sections: CmsSections;
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
