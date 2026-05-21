import type {
  CTAContent,
  HeroContent,
  ShowcaseContent,
  StatItem,
  WorkflowStep,
} from '@/features/marketing/types'

const ENTERPRISE_STAT_IDS = [
  'centralized-oversight',
  'isolated-tenants',
  'localized-readiness',
  'structured-collaboration',
] as const

const COLLABORATION_STEP_IDS = [
  'assign-roles',
  'standardize-workflows',
  'launch-regions',
  'review-performance',
] as const

export function getEnterpriseHeroContent(
  t: (key: string) => string,
): HeroContent {
  return {
    badge: t('enterprisePage.hero.badge'),
    headline: t('enterprisePage.hero.headline'),
    subtext: t('enterprisePage.hero.subtext'),
    primaryCta: {
      label: t('enterprisePage.hero.primaryCta'),
      href: '/signup',
    },
    secondaryCta: {
      label: t('enterprisePage.hero.secondaryCta'),
      href: '/features',
    },
    previewAlt: t('enterprisePage.hero.previewAlt'),
  }
}

export function getEnterpriseStats(
  t: (key: string) => string,
): StatItem[] {
  return ENTERPRISE_STAT_IDS.map((id) => ({
    id,
    value: t(`enterprisePage.stats.items.${id}.value`),
    label: t(`enterprisePage.stats.items.${id}.label`),
    description: t(`enterprisePage.stats.items.${id}.description`),
  }))
}

export function getEnterpriseShowcaseContent(
  t: (key: string) => string,
): ShowcaseContent {
  return {
    heading: t('enterprisePage.showcase.heading'),
    subtext: t('enterprisePage.showcase.subtext'),
    cta: {
      label: t('enterprisePage.showcase.cta'),
      href: '/pricing',
    },
    previewAlt: t('enterprisePage.showcase.previewAlt'),
  }
}

export function getEnterpriseCollaborationSteps(
  t: (key: string) => string,
): WorkflowStep[] {
  return COLLABORATION_STEP_IDS.map((id) => ({
    id,
    title: t(`enterprisePage.collaboration.items.${id}.title`),
    description: t(`enterprisePage.collaboration.items.${id}.description`),
  }))
}

export function getEnterpriseCTAContent(
  t: (key: string) => string,
): CTAContent {
  return {
    title: t('enterprisePage.cta.title'),
    description: t('enterprisePage.cta.description'),
    primaryCta: {
      label: t('enterprisePage.cta.primaryCta'),
      href: '/signup',
    },
    secondaryCta: {
      label: t('enterprisePage.cta.secondaryCta'),
      href: '/pricing',
    },
  }
}
