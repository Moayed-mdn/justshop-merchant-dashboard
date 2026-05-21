import { getTranslations, getLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { buildMetadataFromSeo } from '@/lib/seo/cms-seo'
import { cmsService } from '@/services/cms/cms.service'
import { CmsContent } from '@/components/cms/CmsContent'
import { JsonLd } from '@/components/cms/JsonLd'
import SectionContainer from '@/features/marketing/layouts/SectionContainer'

import {
  getAboutCTAContent,
  getAboutHeroContent,
  getAboutPhilosophyHighlights,
  getAboutShowcaseContent,
  getAboutStats,
  getAboutTrustHighlights,
} from '@/features/marketing/content/about/page-content'

import HeroSection from '@/features/marketing/sections/HeroSection'
import StatsSection from '@/features/marketing/sections/StatsSection'
import DashboardShowcaseSection from '@/features/marketing/sections/DashboardShowcaseSection'
import DetailGridSection from '@/features/marketing/sections/DetailGridSection'
import CTASection from '@/features/marketing/sections/CTASection'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  try {
    const page = await cmsService.getPage('about')
    return buildMetadataFromSeo(page.seo, locale)
  } catch (error) {
    const t = await getTranslations('marketing')
    return {
      title: t('meta.about.title'),
      description: t('meta.about.description'),
    }
  }
}

export default async function AboutPage() {
  const t = await getTranslations('marketing')
  const locale = await getLocale()

  let cmsPage = null
  try {
    cmsPage = await cmsService.getPage('about')
  } catch (error) {
    console.error('Failed to fetch about page from CMS', error)
    // For critical pages, we might want to fall back to static content
    // but if the CMS is the source of truth, notFound() is safer
    notFound()
  }

  const hero = getAboutHeroContent(t)
  const stats = getAboutStats(t)
  const showcase = getAboutShowcaseContent(t)
  const philosophy = getAboutPhilosophyHighlights(t)
  const trust = getAboutTrustHighlights(t)
  const cta = getAboutCTAContent(t)

  return (
    <>
      {cmsPage?.seo?.structured_data && (
        <JsonLd data={cmsPage.seo.structured_data} />
      )}
      <HeroSection {...hero} />

      {cmsPage?.content && (
        <SectionContainer className="py-12">
          <CmsContent content={cmsPage.content} />
        </SectionContainer>
      )}

      <StatsSection items={stats} />

      <DashboardShowcaseSection {...showcase} />

      <DetailGridSection
        heading={t('aboutPage.philosophy.heading')}
        eyebrow={t('aboutPage.philosophy.eyebrow')}
        subtitle={t('aboutPage.philosophy.subtitle')}
        items={philosophy}
        columns={2}
      />

      <DetailGridSection
        heading={t('aboutPage.trust.heading')}
        eyebrow={t('aboutPage.trust.eyebrow')}
        subtitle={t('aboutPage.trust.subtitle')}
        items={trust}
        columns={2}
        className="bg-muted/20"
      />

      <CTASection {...cta} />
    </>
  )
}
