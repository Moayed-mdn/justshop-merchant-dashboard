// =============================================================================
// Marketing — Shared Type Definitions
//
// All marketing content, section props, and SEO config reference these types.
// Sections consume these types as props.
// Content files export values that conform to these types.
// CMS resolvers will return these same types when integrated.
// =============================================================================

// -----------------------------------------------------------------------------
// Navigation
// -----------------------------------------------------------------------------

export interface NavLink {
  label: string
  href: string
  external?: boolean
}

export interface NavGroup {
  label: string
  links: NavLink[]
}

export interface CTALink {
  label: string
  href: string
}

// -----------------------------------------------------------------------------
// SEO
// -----------------------------------------------------------------------------

export interface MarketingPageMeta {
  locale: string
  title: string
  description: string
  /** Path segment after locale prefix. Empty string for homepage. */
  path: string
  ogImage?: string
}

// -----------------------------------------------------------------------------
// Hero
// -----------------------------------------------------------------------------

export interface HeroContent {
  badge?: string
  headline: string
  subtext: string
  primaryCta: CTALink
  secondaryCta?: CTALink
  previewAlt: string
}

// -----------------------------------------------------------------------------
// Logo Cloud
// -----------------------------------------------------------------------------

export interface LogoItem {
  name: string
  /** Path relative to /public */
  src: string
  width: number
  height: number
}

// -----------------------------------------------------------------------------
// Features
// -----------------------------------------------------------------------------

export interface FeatureItem {
  id: string
  icon: string
  title: string
  description: string
}

export interface StatItem {
  id: string
  value: string
  label: string
  description: string
}

export interface HighlightItem {
  id: string
  eyebrow?: string
  title: string
  description: string
  points?: string[]
}

export interface WorkflowStep {
  id: string
  title: string
  description: string
}

export interface ActionCardItem {
  id: string
  icon: string
  title: string
  description: string
  href: string
  ctaLabel: string
  eyebrow?: string
}

export interface FormShellField {
  id: string
  label: string
  placeholder: string
  type: 'text' | 'email' | 'textarea'
}

export interface FormShellContent {
  heading: string
  eyebrow?: string
  subtitle: string
  note: string
  fields: FormShellField[]
  formCtaLabel: string
  formHelper: string
  primaryCta?: CTALink
  secondaryCta?: CTALink
}

export interface ResourceShellItem {
  id: string
  title: string
  description: string
  meta: string
}

export interface ResourceShellContent {
  heading: string
  eyebrow?: string
  subtitle: string
  searchLabel: string
  searchPlaceholder: string
  sidebarTitle: string
  sidebarItems: string[]
  cards: ResourceShellItem[]
  note: string
}

// -----------------------------------------------------------------------------
// Showcase / Split Section
// -----------------------------------------------------------------------------

export interface ShowcaseContent {
  heading: string
  subtext: string
  cta?: CTALink
  previewAlt: string
  /** Path relative to /public — optional until real asset exists */
  previewSrc?: string
}

// -----------------------------------------------------------------------------
// Testimonials
// -----------------------------------------------------------------------------

export interface TestimonialItem {
  id: string
  quote: string
  authorName: string
  authorRole: string
  authorCompany?: string
  /** Path relative to /public — optional */
  avatarSrc?: string
}

// -----------------------------------------------------------------------------
// Pricing
// -----------------------------------------------------------------------------

export interface PricingFeature {
  label: string
  included: boolean
}

export type PricingInterval = 'monthly' | 'annual'

export interface PricingPlan {
  id: string
  name: string
  description: string
  monthlyPrice: number | null
  annualPrice: number | null
  /** null = contact sales */
  currency: string
  highlighted: boolean
  ctaLabel: string
  ctaHref: string
  features: PricingFeature[]
}

// -----------------------------------------------------------------------------
// FAQ
// -----------------------------------------------------------------------------

export interface FAQItem {
  id: string
  question: string
  answer: string
}

// -----------------------------------------------------------------------------
// CTA Section
// -----------------------------------------------------------------------------

export interface CTAContent {
  title: string
  description: string
  primaryCta: CTALink
  secondaryCta?: CTALink
}

// -----------------------------------------------------------------------------
// Section Heading
// -----------------------------------------------------------------------------

export type HeadingAlign = 'left' | 'center'
export type HeadingLevel = 'h1' | 'h2' | 'h3'
