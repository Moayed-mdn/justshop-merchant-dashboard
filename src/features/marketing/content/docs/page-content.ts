import type {
  CTAContent,
  HeroContent,
  ResourceShellContent,
  StatItem,
} from '@/features/marketing/types'

const DOCS_STAT_IDS = [
  'implementation-guides',
  'api-reference',
  'tenant-patterns',
  'cms-ready',
] as const

export function getDocsHeroContent(
  t: (key: string) => string,
): HeroContent {
  return {
    badge: t('docsPage.hero.badge'),
    headline: t('docsPage.hero.headline'),
    subtext: t('docsPage.hero.subtext'),
    primaryCta: {
      label: t('docsPage.hero.primaryCta'),
      href: '/contact',
    },
    secondaryCta: {
      label: t('docsPage.hero.secondaryCta'),
      href: '/features',
    },
    previewAlt: t('docsPage.hero.previewAlt'),
  }
}

export function getDocsStats(
  t: (key: string) => string,
): StatItem[] {
  return DOCS_STAT_IDS.map((id) => ({
    id,
    value: t(`docsPage.stats.items.${id}.value`),
    label: t(`docsPage.stats.items.${id}.label`),
    description: t(`docsPage.stats.items.${id}.description`),
  }))
}

export function getDocsResourceShellContent(
  t: (key: string) => string,
): ResourceShellContent {
  return {
    heading: t('docsPage.shell.heading'),
    eyebrow: t('docsPage.shell.eyebrow'),
    subtitle: t('docsPage.shell.subtitle'),
    searchLabel: t('docsPage.shell.searchLabel'),
    searchPlaceholder: t('docsPage.shell.searchPlaceholder'),
    sidebarTitle: t('docsPage.shell.sidebarTitle'),
    sidebarItems: [
      t('docsPage.shell.sidebarItems.one'),
      t('docsPage.shell.sidebarItems.two'),
      t('docsPage.shell.sidebarItems.three'),
      t('docsPage.shell.sidebarItems.four'),
    ],
    cards: [
      {
        id: 'api',
        title: t('docsPage.shell.cards.api.title'),
        description: t('docsPage.shell.cards.api.description'),
        meta: t('docsPage.shell.cards.api.meta'),
      },
      {
        id: 'setup',
        title: t('docsPage.shell.cards.setup.title'),
        description: t('docsPage.shell.cards.setup.description'),
        meta: t('docsPage.shell.cards.setup.meta'),
      },
      {
        id: 'auth',
        title: t('docsPage.shell.cards.auth.title'),
        description: t('docsPage.shell.cards.auth.description'),
        meta: t('docsPage.shell.cards.auth.meta'),
      },
      {
        id: 'deployment',
        title: t('docsPage.shell.cards.deployment.title'),
        description: t('docsPage.shell.cards.deployment.description'),
        meta: t('docsPage.shell.cards.deployment.meta'),
      },
    ],
    note: t('docsPage.shell.note'),
  }
}

export function getDocsCTAContent(
  t: (key: string) => string,
): CTAContent {
  return {
    title: t('docsPage.cta.title'),
    description: t('docsPage.cta.description'),
    primaryCta: {
      label: t('docsPage.cta.primaryCta'),
      href: '/contact',
    },
    secondaryCta: {
      label: t('docsPage.cta.secondaryCta'),
      href: '/enterprise',
    },
  }
}
