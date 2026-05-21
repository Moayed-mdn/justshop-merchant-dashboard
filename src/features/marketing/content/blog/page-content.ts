import type {
  CTAContent,
  HeroContent,
  ResourceShellContent,
  StatItem,
} from '@/features/marketing/types'

const BLOG_STAT_IDS = [
  'editorial-plan',
  'commerce-topics',
  'future-slugs',
  'cms-ready',
] as const

export function getBlogHeroContent(
  t: (key: string) => string,
): HeroContent {
  return {
    badge: t('blogPage.hero.badge'),
    headline: t('blogPage.hero.headline'),
    subtext: t('blogPage.hero.subtext'),
    primaryCta: {
      label: t('blogPage.hero.primaryCta'),
      href: '/contact',
    },
    secondaryCta: {
      label: t('blogPage.hero.secondaryCta'),
      href: '/docs',
    },
    previewAlt: t('blogPage.hero.previewAlt'),
  }
}

export function getBlogStats(
  t: (key: string) => string,
): StatItem[] {
  return BLOG_STAT_IDS.map((id) => ({
    id,
    value: t(`blogPage.stats.items.${id}.value`),
    label: t(`blogPage.stats.items.${id}.label`),
    description: t(`blogPage.stats.items.${id}.description`),
  }))
}

export function getBlogResourceShellContent(
  t: (key: string) => string,
): ResourceShellContent {
  return {
    heading: t('blogPage.shell.heading'),
    eyebrow: t('blogPage.shell.eyebrow'),
    subtitle: t('blogPage.shell.subtitle'),
    searchLabel: t('blogPage.shell.searchLabel'),
    searchPlaceholder: t('blogPage.shell.searchPlaceholder'),
    sidebarTitle: t('blogPage.shell.sidebarTitle'),
    sidebarItems: [
      t('blogPage.shell.sidebarItems.one'),
      t('blogPage.shell.sidebarItems.two'),
      t('blogPage.shell.sidebarItems.three'),
      t('blogPage.shell.sidebarItems.four'),
    ],
    cards: [
      {
        id: 'operations',
        title: t('blogPage.shell.cards.operations.title'),
        description: t('blogPage.shell.cards.operations.description'),
        meta: t('blogPage.shell.cards.operations.meta'),
      },
      {
        id: 'architecture',
        title: t('blogPage.shell.cards.architecture.title'),
        description: t('blogPage.shell.cards.architecture.description'),
        meta: t('blogPage.shell.cards.architecture.meta'),
      },
      {
        id: 'growth',
        title: t('blogPage.shell.cards.growth.title'),
        description: t('blogPage.shell.cards.growth.description'),
        meta: t('blogPage.shell.cards.growth.meta'),
      },
      {
        id: 'product',
        title: t('blogPage.shell.cards.product.title'),
        description: t('blogPage.shell.cards.product.description'),
        meta: t('blogPage.shell.cards.product.meta'),
      },
    ],
    note: t('blogPage.shell.note'),
  }
}

export function getBlogCTAContent(
  t: (key: string) => string,
): CTAContent {
  return {
    title: t('blogPage.cta.title'),
    description: t('blogPage.cta.description'),
    primaryCta: {
      label: t('blogPage.cta.primaryCta'),
      href: '/contact',
    },
    secondaryCta: {
      label: t('blogPage.cta.secondaryCta'),
      href: '/features',
    },
  }
}
