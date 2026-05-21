import { getTranslations, getLocale } from 'next-intl/server'
import type { Metadata } from 'next'

import { buildPageMetadata } from '@/features/marketing/lib/seo'
import {
  getDemoCTAContent,
  getDemoHeroContent,
  getDemoRequestCards,
  getDemoShowcaseContent,
  getDemoStats,
  getDemoWalkthroughHighlights,
} from '@/features/marketing/content/demo/page-content'

import HeroSection from '@/features/marketing/sections/HeroSection'
import StatsSection from '@/features/marketing/sections/StatsSection'
import DashboardShowcaseSection from '@/features/marketing/sections/DashboardShowcaseSection'
import DetailGridSection from '@/features/marketing/sections/DetailGridSection'
import ActionCardSection from '@/features/marketing/sections/ActionCardSection'
import CTASection from '@/features/marketing/sections/CTASection'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('marketing')
  const locale = await getLocale()

  return buildPageMetadata({
    locale,
    title: t('meta.demo.title'),
    description: t('meta.demo.description'),
    path: '/demo',
  })
}

export default async function DemoPage() {
  const t = await getTranslations('marketing')

  const hero = getDemoHeroContent(t)
  const stats = getDemoStats(t)
  const showcase = getDemoShowcaseContent(t)
  const walkthrough = getDemoWalkthroughHighlights(t)
  const requestCards = getDemoRequestCards(t)
  const cta = getDemoCTAContent(t)

  return (
    <>
      <HeroSection {...hero} />

      <StatsSection items={stats} />

      <DashboardShowcaseSection {...showcase} />

      <DetailGridSection
        heading={t('demoPage.walkthrough.heading')}
        eyebrow={t('demoPage.walkthrough.eyebrow')}
        subtitle={t('demoPage.walkthrough.subtitle')}
        items={walkthrough}
        columns={2}
      />

      <ActionCardSection
        heading={t('demoPage.request.heading')}
        eyebrow={t('demoPage.request.eyebrow')}
        subtitle={t('demoPage.request.subtitle')}
        items={requestCards}
        columns={3}
        className="bg-muted/20"
      />

      <CTASection {...cta} />
    </>
  )
}
