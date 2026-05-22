import { getLocale, getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { buildMetadataFromSeo } from '@/lib/seo/cms-seo'
import { cmsService } from '@/services/cms/cms.service'
import { BlogList } from '@/features/cms/blog/components/BlogList'
import { JsonLd } from '@/components/cms/JsonLd'
import { CmsSectionRenderer } from '@/components/cms/CmsSectionRenderer'
import SectionContainer from '@/features/marketing/layouts/SectionContainer'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  try {
    const page = await cmsService.getPage('blog')
    return buildMetadataFromSeo(page.seo, locale)
  } catch (error) {
    return {
      title: 'Blog | LaraTenant Commerce',
      description: 'Latest insights and updates from LaraTenant Commerce',
    }
  }
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const locale = await getLocale()
  const t = await getTranslations('marketing.sections.blog')
  const { page: pageStr } = await searchParams
  const page = pageStr ? parseInt(pageStr, 10) : 1

  const blogData = await cmsService.getBlogPosts({ page, per_page: 9 })
  
  let cmsPage = null
  try {
    cmsPage = await cmsService.getPage('blog')
  } catch (error) {
    console.error('Failed to fetch blog page from CMS', error)
    notFound()
  }

  return (
    <>
      {cmsPage?.seo?.structured_data && (
        <JsonLd data={cmsPage.seo.structured_data} />
      )}
      
      {/* CMS sections for Hero, Categories, etc. (Excluding CTA which goes to bottom) */}
      <CmsSectionRenderer sections={cmsPage?.sections} exclude={['cta']} />
      
      <SectionContainer className="py-20">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight">{t('latest_posts_heading')}</h2>
          <p className="text-muted-foreground mt-2">{t('latest_posts_subtext')}</p>
        </div>
        
        <BlogList posts={blogData.data} locale={locale} />
      </SectionContainer>

      {/* Final CTA from CMS at the bottom */}
      <CmsSectionRenderer sections={cmsPage?.sections} includeOnly={['cta']} />
    </>
  )
}
