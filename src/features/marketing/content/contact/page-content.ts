import type {
  ActionCardItem,
  CTAContent,
  FormShellContent,
  HeroContent,
  ResourceShellContent,
  StatItem,
} from '@/features/marketing/types'

const CONTACT_STAT_IDS = [
  'sales-routing',
  'support-guidance',
  'response-window',
  'enterprise-path',
] as const

const CONTACT_CARD_IDS = [
  'sales',
  'support',
  'enterprise',
] as const

const FAQ_SHORTCUT_IDS = [
  'features',
  'pricing',
  'docs',
  'demo',
] as const

const FORM_FIELD_IDS = [
  'name',
  'email',
  'company',
  'message',
] as const

export function getContactHeroContent(
  t: (key: string) => string,
): HeroContent {
  return {
    badge: t('contactPage.hero.badge'),
    headline: t('contactPage.hero.headline'),
    subtext: t('contactPage.hero.subtext'),
    primaryCta: {
      label: t('contactPage.hero.primaryCta'),
      href: '/demo',
    },
    secondaryCta: {
      label: t('contactPage.hero.secondaryCta'),
      href: '/docs',
    },
    previewAlt: t('contactPage.hero.previewAlt'),
  }
}

export function getContactStats(
  t: (key: string) => string,
): StatItem[] {
  return CONTACT_STAT_IDS.map((id) => ({
    id,
    value: t(`contactPage.stats.items.${id}.value`),
    label: t(`contactPage.stats.items.${id}.label`),
    description: t(`contactPage.stats.items.${id}.description`),
  }))
}

export function getContactMethodCards(
  t: (key: string) => string,
): ActionCardItem[] {
  return CONTACT_CARD_IDS.map((id) => ({
    id,
    icon: t(`contactPage.methods.items.${id}.icon`),
    eyebrow: t(`contactPage.methods.items.${id}.eyebrow`),
    title: t(`contactPage.methods.items.${id}.title`),
    description: t(`contactPage.methods.items.${id}.description`),
    href: t(`contactPage.methods.items.${id}.href`),
    ctaLabel: t(`contactPage.methods.items.${id}.cta`),
  }))
}

export function getContactFormShellContent(
  t: (key: string) => string,
): FormShellContent {
  return {
    heading: t('contactPage.form.heading'),
    eyebrow: t('contactPage.form.eyebrow'),
    subtitle: t('contactPage.form.subtitle'),
    note: t('contactPage.form.note'),
    fields: FORM_FIELD_IDS.map((id) => ({
      id,
      label: t(`contactPage.form.fields.${id}.label`),
      placeholder: t(`contactPage.form.fields.${id}.placeholder`),
      type: id === 'message' ? 'textarea' : id === 'email' ? 'email' : 'text',
    })),
    formCtaLabel: t('contactPage.form.formCtaLabel'),
    formHelper: t('contactPage.form.formHelper'),
    primaryCta: {
      label: t('contactPage.form.primaryCta'),
      href: 'mailto:hello@laratenant.com',
    },
    secondaryCta: {
      label: t('contactPage.form.secondaryCta'),
      href: '/pricing',
    },
  }
}

export function getContactResourceShellContent(
  t: (key: string) => string,
): ResourceShellContent {
  return {
    heading: t('contactPage.shortcuts.heading'),
    eyebrow: t('contactPage.shortcuts.eyebrow'),
    subtitle: t('contactPage.shortcuts.subtitle'),
    searchLabel: t('contactPage.shortcuts.searchLabel'),
    searchPlaceholder: t('contactPage.shortcuts.searchPlaceholder'),
    sidebarTitle: t('contactPage.shortcuts.sidebarTitle'),
    sidebarItems: [
      t('contactPage.shortcuts.sidebarItems.one'),
      t('contactPage.shortcuts.sidebarItems.two'),
      t('contactPage.shortcuts.sidebarItems.three'),
      t('contactPage.shortcuts.sidebarItems.four'),
    ],
    cards: FAQ_SHORTCUT_IDS.map((id) => ({
      id,
      title: t(`contactPage.shortcuts.cards.${id}.title`),
      description: t(`contactPage.shortcuts.cards.${id}.description`),
      meta: t(`contactPage.shortcuts.cards.${id}.meta`),
    })),
    note: t('contactPage.shortcuts.note'),
  }
}

export function getContactCTAContent(
  t: (key: string) => string,
): CTAContent {
  return {
    title: t('contactPage.cta.title'),
    description: t('contactPage.cta.description'),
    primaryCta: {
      label: t('contactPage.cta.primaryCta'),
      href: '/demo',
    },
    secondaryCta: {
      label: t('contactPage.cta.secondaryCta'),
      href: '/enterprise',
    },
  }
}
