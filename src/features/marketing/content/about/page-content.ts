import type {
  CTAContent,
  HeroContent,
  HighlightItem,
  ShowcaseContent,
  StatItem,
} from '@/features/marketing/types'

const ABOUT_STAT_IDS = [
  'merchant-focused',
  'tenant-aware',
  'locale-ready',
  'server-first',
] as const

const PHILOSOPHY_IDS = [
  'clarity-over-complexity',
  'reuse-over-fragmentation',
  'scale-with-structure',
  'merchant-control',
] as const

const TRUST_IDS = [
  'secure-foundation',
  'reliable-rendering',
  'operational-consistency',
  'global-readiness',
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

export function getAboutHeroContent(
  t: (key: string) => string,
): HeroContent {
  return {
    badge: t('aboutPage.hero.badge'),
    headline: t('aboutPage.hero.headline'),
    subtext: t('aboutPage.hero.subtext'),
    primaryCta: {
      label: t('aboutPage.hero.primaryCta'),
      href: '/features',
    },
    secondaryCta: {
      label: t('aboutPage.hero.secondaryCta'),
      href: '/signup',
    },
    previewAlt: t('aboutPage.hero.previewAlt'),
  }
}

export function getAboutStats(
  t: (key: string) => string,
): StatItem[] {
  return ABOUT_STAT_IDS.map((id) => ({
    id,
    value: t(`aboutPage.stats.items.${id}.value`),
    label: t(`aboutPage.stats.items.${id}.label`),
    description: t(`aboutPage.stats.items.${id}.description`),
  }))
}

export function getAboutShowcaseContent(
  t: (key: string) => string,
): ShowcaseContent {
  return {
    heading: t('aboutPage.showcase.heading'),
    subtext: t('aboutPage.showcase.subtext'),
    cta: {
      label: t('aboutPage.showcase.cta'),
      href: '/enterprise',
    },
    previewAlt: t('aboutPage.showcase.previewAlt'),
  }
}

export function getAboutPhilosophyHighlights(
  t: (key: string) => string,
): HighlightItem[] {
  return PHILOSOPHY_IDS.map((id) =>
    getHighlight(t, 'aboutPage.philosophy', id),
  )
}

export function getAboutTrustHighlights(
  t: (key: string) => string,
): HighlightItem[] {
  return TRUST_IDS.map((id) =>
    getHighlight(t, 'aboutPage.trust', id),
  )
}

export function getAboutCTAContent(
  t: (key: string) => string,
): CTAContent {
  return {
    title: t('aboutPage.cta.title'),
    description: t('aboutPage.cta.description'),
    primaryCta: {
      label: t('aboutPage.cta.primaryCta'),
      href: '/signup',
    },
    secondaryCta: {
      label: t('aboutPage.cta.secondaryCta'),
      href: '/contact',
    },
  }
}
