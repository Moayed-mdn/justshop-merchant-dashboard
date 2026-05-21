// =============================================================================
// Enterprise Page — Marketing Route
//
// Dedicated enterprise marketing page for larger operators and multi-brand
// commerce teams. Owns metadata and composes reusable localized sections.
// =============================================================================

import { getTranslations, getLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { buildPageMetadata } from '@/features/marketing/lib/seo'

import {
  getEnterpriseCapabilities,
  getEnterpriseGlobalHighlights,
  getEnterpriseSecurityHighlights,
} from '@/features/marketing/content/enterprise/highlights'
import {
  getEnterpriseCTAContent,
  getEnterpriseCollaborationSteps,
  getEnterpriseHeroContent,
  getEnterpriseShowcaseContent,
  getEnterpriseStats,
} from '@/features/marketing/content/enterprise/page-content'

import HeroSection from '@/features/marketing/sections/HeroSection'
import StatsSection from '@/features/marketing/sections/StatsSection'
import DetailGridSection from '@/features/marketing/sections/DetailGridSection'
import DashboardShowcaseSection from '@/features/marketing/sections/DashboardShowcaseSection'
import WorkflowSection from '@/features/marketing/sections/WorkflowSection'
import CTASection from '@/features/marketing/sections/CTASection'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('marketing')
  const locale = await getLocale()
  return buildPageMetadata({
    locale,
    title: t('meta.enterprise.title'),
    description: t('meta.enterprise.description'),
    path: '/enterprise',
  })
}

export default async function EnterprisePage() {
  const t = await getTranslations('marketing')

  const hero = getEnterpriseHeroContent(t)
  const stats = getEnterpriseStats(t)
  const capabilities = getEnterpriseCapabilities(t)
  const showcase = getEnterpriseShowcaseContent(t)
  const security = getEnterpriseSecurityHighlights(t)
  const collaboration = getEnterpriseCollaborationSteps(t)
  const globalCommerce = getEnterpriseGlobalHighlights(t)
  const cta = getEnterpriseCTAContent(t)

  return (
    <>
      <HeroSection {...hero} />

      <StatsSection items={stats} />

      <DetailGridSection
        heading={t('enterprisePage.capabilities.heading')}
        eyebrow={t('enterprisePage.capabilities.eyebrow')}
        subtitle={t('enterprisePage.capabilities.subtitle')}
        items={capabilities}
        columns={3}
      />

      <DashboardShowcaseSection {...showcase} />

      <DetailGridSection
        heading={t('enterprisePage.security.heading')}
        eyebrow={t('enterprisePage.security.eyebrow')}
        subtitle={t('enterprisePage.security.subtitle')}
        items={security}
        columns={2}
      />

      <WorkflowSection
        heading={t('enterprisePage.collaboration.heading')}
        eyebrow={t('enterprisePage.collaboration.eyebrow')}
        subtitle={t('enterprisePage.collaboration.subtitle')}
        steps={collaboration}
        className="bg-muted/20"
      />

      <DetailGridSection
        heading={t('enterprisePage.global.heading')}
        eyebrow={t('enterprisePage.global.eyebrow')}
        subtitle={t('enterprisePage.global.subtitle')}
        items={globalCommerce}
        columns={2}
      />

      <CTASection {...cta} />
    </>
  )
}
