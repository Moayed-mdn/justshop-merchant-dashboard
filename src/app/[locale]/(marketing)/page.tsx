import { getLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { buildMetadataFromSeo } from '@/lib/seo/cms-seo'
import { cmsService } from '@/services/cms/cms.service'
import { CmsContent } from '@/components/cms/CmsContent'
import { JsonLd } from '@/components/cms/JsonLd'
import { CmsSectionRenderer } from '@/components/cms/CmsSectionRenderer'
import SectionContainer from '@/features/marketing/layouts/SectionContainer'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  try {
    const page = await cmsService.getPage('home')
    return buildMetadataFromSeo(page.seo, locale)
  } catch (error) {
    return {
      title: 'LaraTenant Commerce',
      description: 'Modern multi-tenant ecommerce platform',
    }
  }
}

export default async function HomePage() {
  const locale = await getLocale()

  let cmsPage = null
  try {
    cmsPage = await cmsService.getPage('home')
  } catch (error) {
    console.error('Failed to fetch home page from CMS', error)
    notFound()
  }

  return (
    <>
      {cmsPage?.seo?.structured_data && (
        <JsonLd data={cmsPage.seo.structured_data} />
      )}

      {/* Fully CMS-driven sections rendering */}
      <CmsSectionRenderer sections={cmsPage?.sections} />

      {cmsPage?.content && (
        <SectionContainer className="py-12">
          <CmsContent content={cmsPage.content} />
        </SectionContainer>
      )}
    </>
  )
}
