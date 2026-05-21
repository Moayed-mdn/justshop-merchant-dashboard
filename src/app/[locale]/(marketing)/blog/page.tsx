import { getTranslations, getLocale } from 'next-intl/server'
import type { Metadata } from 'next'

import { buildMetadataFromSeo } from '@/lib/seo/cms-seo'
import { cmsService } from '@/services/cms/cms.service'
import { BlogList } from '@/features/cms/blog/components/BlogList'
import { JsonLd } from '@/components/cms/JsonLd'
import SectionContainer from '@/features/marketing/layouts/SectionContainer'

import {
  getBlogCTAContent,
  getBlogHeroContent,
  getBlogStats,
} from '@/features/marketing/content/blog/page-content'

import HeroSection from '@/features/marketing/sections/HeroSection'
import StatsSection from '@/features/marketing/sections/StatsSection'
import CTASection from '@/features/marketing/sections/CTASection'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  try {
    const page = await cmsService.getPage('blog')
    return buildMetadataFromSeo(page.seo, locale)
  } catch (error) {
    const t = await getTranslations('marketing')
    return {
      title: t('meta.blog.title'),
      description: t('meta.blog.description'),
    }
  }
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const t = await getTranslations('marketing')
  const locale = await getLocale()
  const { page: pageStr } = await searchParams
  const page = pageStr ? parseInt(pageStr, 10) : 1

  const blogData = await cmsService.getBlogPosts({ page, per_page: 9 })
  
  let cmsPage = null
  try {
    cmsPage = await cmsService.getPage('blog')
  } catch (error) {
    console.error('Failed to fetch blog page from CMS', error)
    // Blog index can still show posts even if the page metadata/content fails
  }

  const hero = getBlogHeroContent(t)
  const stats = getBlogStats(t)
  const cta = getBlogCTAContent(t)

  return (
    <>
      {cmsPage?.seo?.structured_data && (
        <JsonLd data={cmsPage.seo.structured_data} />
      )}
      <HeroSection {...hero} />
      
      <SectionContainer className="py-20">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight">{t('blogPage.latestPosts.heading')}</h2>
          <p className="text-muted-foreground mt-2">{t('blogPage.latestPosts.subtitle')}</p>
        </div>
        
        <BlogList posts={blogData.data} locale={locale} />
        
        {/* Simple Pagination could be added here */}
      </SectionContainer>

      <StatsSection items={stats} />
      <CTASection {...cta} />
    </>
  )
}
