import type {
  CTAContent,
  HeroContent,
  HighlightItem,
  ShowcaseContent,
  StatItem,
  WorkflowStep,
} from '@/features/marketing/types'

const FEATURE_STAT_IDS = [
  'unified-operations',
  'store-isolation',
  'localized-commerce',
  'ssr-foundation',
] as const

const WORKFLOW_STEP_IDS = [
  'create-products',
  'manage-inventory',
  'launch-storefront',
  'track-analytics',
] as const

const ARCHITECTURE_HIGHLIGHT_IDS = [
  'tenant-isolation',
  'scalable-operations',
  'admin-tooling',
  'localization-ready',
] as const

const RELIABILITY_HIGHLIGHT_IDS = [
  'server-rendering',
  'fast-dashboards',
  'secure-auth',
  'modern-stack',
] as const

export function getFeaturesHeroContent(
  t: (key: string) => string,
): HeroContent {
  return {
    badge: t('featuresPage.hero.badge'),
    headline: t('featuresPage.hero.headline'),
    subtext: t('featuresPage.hero.subtext'),
    primaryCta: {
      label: t('featuresPage.hero.primaryCta'),
      href: '/signup',
    },
    secondaryCta: {
      label: t('featuresPage.hero.secondaryCta'),
      href: '/pricing',
    },
    previewAlt: t('featuresPage.hero.previewAlt'),
  }
}

export function getFeaturePageStats(
  t: (key: string) => string,
): StatItem[] {
  return FEATURE_STAT_IDS.map((id) => ({
    id,
    value: t(`featuresPage.stats.items.${id}.value`),
    label: t(`featuresPage.stats.items.${id}.label`),
    description: t(`featuresPage.stats.items.${id}.description`),
  }))
}

export function getFeaturesShowcaseContent(
  t: (key: string) => string,
): ShowcaseContent {
  return {
    heading: t('featuresPage.showcase.heading'),
    subtext: t('featuresPage.showcase.subtext'),
    cta: {
      label: t('featuresPage.showcase.cta'),
      href: '/signup',
    },
    previewAlt: t('featuresPage.showcase.previewAlt'),
  }
}

export function getFeatureWorkflowSteps(
  t: (key: string) => string,
): WorkflowStep[] {
  return WORKFLOW_STEP_IDS.map((id) => ({
    id,
    title: t(`featuresPage.workflow.items.${id}.title`),
    description: t(`featuresPage.workflow.items.${id}.description`),
  }))
}

function getHighlightItem(
  t: (key: string) => string,
  path: string,
  id: string,
): HighlightItem {
  return {
    id,
    eyebrow: t(`${path}.items.${id}.eyebrow`),
    title: t(`${path}.items.${id}.title`),
    description: t(`${path}.items.${id}.description`),
    points: [
      t(`${path}.items.${id}.pointOne`),
      t(`${path}.items.${id}.pointTwo`),
    ],
  }
}

export function getArchitectureHighlights(
  t: (key: string) => string,
): HighlightItem[] {
  return ARCHITECTURE_HIGHLIGHT_IDS.map((id) =>
    getHighlightItem(t, 'featuresPage.architecture', id),
  )
}

export function getReliabilityHighlights(
  t: (key: string) => string,
): HighlightItem[] {
  return RELIABILITY_HIGHLIGHT_IDS.map((id) =>
    getHighlightItem(t, 'featuresPage.reliability', id),
  )
}

export function getFeaturesCTAContent(
  t: (key: string) => string,
): CTAContent {
  return {
    title: t('featuresPage.cta.title'),
    description: t('featuresPage.cta.description'),
    primaryCta: {
      label: t('featuresPage.cta.primaryCta'),
      href: '/signup',
    },
    secondaryCta: {
      label: t('featuresPage.cta.secondaryCta'),
      href: '/enterprise',
    },
  }
}
