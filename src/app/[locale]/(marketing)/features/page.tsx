// =============================================================================
// Features Page — Marketing Route
//
// Dedicated product marketing page for merchant-facing capabilities.
// Owns metadata and composes reusable marketing sections with localized content.
// =============================================================================

import { getTranslations, getLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { buildPageMetadata } from '@/features/marketing/lib/seo'

import { getExtendedFeatures } from '@/features/marketing/content/features/feature-list'
import {
  getArchitectureHighlights,
  getFeaturePageStats,
  getFeaturesCTAContent,
  getFeaturesHeroContent,
  getFeaturesShowcaseContent,
  getFeatureWorkflowSteps,
  getReliabilityHighlights,
} from '@/features/marketing/content/features/page-content'

import HeroSection from '@/features/marketing/sections/HeroSection'
import StatsSection from '@/features/marketing/sections/StatsSection'
import FeatureGridSection from '@/features/marketing/sections/FeatureGridSection'
import DashboardShowcaseSection from '@/features/marketing/sections/DashboardShowcaseSection'
import WorkflowSection from '@/features/marketing/sections/WorkflowSection'
import DetailGridSection from '@/features/marketing/sections/DetailGridSection'
import CTASection from '@/features/marketing/sections/CTASection'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('marketing')
  const locale = await getLocale()
  return buildPageMetadata({
    locale,
    title: t('meta.features.title'),
    description: t('meta.features.description'),
    path: '/features',
  })
}

export default async function FeaturesPage() {
  const t = await getTranslations('marketing')

  const hero = getFeaturesHeroContent(t)
  const stats = getFeaturePageStats(t)
  const features = getExtendedFeatures(t)
  const showcase = getFeaturesShowcaseContent(t)
  const workflow = getFeatureWorkflowSteps(t)
  const architecture = getArchitectureHighlights(t)
  const reliability = getReliabilityHighlights(t)
  const cta = getFeaturesCTAContent(t)

  return (
    <>
      <HeroSection {...hero} />

      <StatsSection items={stats} />

      <FeatureGridSection
        heading={t('featuresPage.grid.heading')}
        eyebrow={t('featuresPage.grid.eyebrow')}
        subtitle={t('featuresPage.grid.subtitle')}
        items={features}
      />

      <DashboardShowcaseSection {...showcase} />

      <WorkflowSection
        heading={t('featuresPage.workflow.heading')}
        eyebrow={t('featuresPage.workflow.eyebrow')}
        subtitle={t('featuresPage.workflow.subtitle')}
        steps={workflow}
      />

      <DetailGridSection
        heading={t('featuresPage.architecture.heading')}
        eyebrow={t('featuresPage.architecture.eyebrow')}
        subtitle={t('featuresPage.architecture.subtitle')}
        items={architecture}
        columns={2}
      />

      <DetailGridSection
        heading={t('featuresPage.reliability.heading')}
        eyebrow={t('featuresPage.reliability.eyebrow')}
        subtitle={t('featuresPage.reliability.subtitle')}
        items={reliability}
        columns={2}
        className="bg-muted/20"
      />

      <CTASection {...cta} />
    </>
  )
}
