import type {
  ActionCardItem,
  CTAContent,
  HeroContent,
  HighlightItem,
  ShowcaseContent,
  StatItem,
} from '@/features/marketing/types'

const DEMO_STAT_IDS = [
  'guided-tour',
  'merchant-workflows',
  'enterprise-context',
  'integration-ready',
] as const

const WALKTHROUGH_IDS = [
  'catalog-operations',
  'storefront-readiness',
  'order-visibility',
  'team-collaboration',
] as const

const REQUEST_IDS = [
  'sales-conversation',
  'technical-review',
  'launch-planning',
] as const

function getHighlight(
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

export function getDemoHeroContent(
  t: (key: string) => string,
): HeroContent {
  return {
    badge: t('demoPage.hero.badge'),
    headline: t('demoPage.hero.headline'),
    subtext: t('demoPage.hero.subtext'),
    primaryCta: {
      label: t('demoPage.hero.primaryCta'),
      href: '/contact',
    },
    secondaryCta: {
      label: t('demoPage.hero.secondaryCta'),
      href: '/features',
    },
    previewAlt: t('demoPage.hero.previewAlt'),
  }
}

export function getDemoStats(
  t: (key: string) => string,
): StatItem[] {
  return DEMO_STAT_IDS.map((id) => ({
    id,
    value: t(`demoPage.stats.items.${id}.value`),
    label: t(`demoPage.stats.items.${id}.label`),
    description: t(`demoPage.stats.items.${id}.description`),
  }))
}

export function getDemoShowcaseContent(
  t: (key: string) => string,
): ShowcaseContent {
  return {
    heading: t('demoPage.showcase.heading'),
    subtext: t('demoPage.showcase.subtext'),
    cta: {
      label: t('demoPage.showcase.cta'),
      href: '/contact',
    },
    previewAlt: t('demoPage.showcase.previewAlt'),
  }
}

export function getDemoWalkthroughHighlights(
  t: (key: string) => string,
): HighlightItem[] {
  return WALKTHROUGH_IDS.map((id) =>
    getHighlight(t, 'demoPage.walkthrough', id),
  )
}

export function getDemoRequestCards(
  t: (key: string) => string,
): ActionCardItem[] {
  return REQUEST_IDS.map((id) => ({
    id,
    icon: t(`demoPage.request.items.${id}.icon`),
    eyebrow: t(`demoPage.request.items.${id}.eyebrow`),
    title: t(`demoPage.request.items.${id}.title`),
    description: t(`demoPage.request.items.${id}.description`),
    ctaLabel: t(`demoPage.request.items.${id}.cta`),
    href: '/contact',
  }))
}

export function getDemoCTAContent(
  t: (key: string) => string,
): CTAContent {
  return {
    title: t('demoPage.cta.title'),
    description: t('demoPage.cta.description'),
    primaryCta: {
      label: t('demoPage.cta.primaryCta'),
      href: '/contact',
    },
    secondaryCta: {
      label: t('demoPage.cta.secondaryCta'),
      href: '/pricing',
    },
  }
}
