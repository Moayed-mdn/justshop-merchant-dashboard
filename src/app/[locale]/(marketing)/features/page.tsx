import { getLocale, getTranslations } from 'next-intl/server'
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
  const t = await getTranslations('marketing.meta.features')
  try {
    const page = await cmsService.getPage('features')
    return buildMetadataFromSeo(page.seo, locale)
  } catch (error) {
    return {
      title: `${t('title')} | LaraTenant Commerce`,
      description: t('description'),
    }
  }
}

export default async function FeaturesPage() {
  const locale = await getLocale()

  let cmsPage = null
  try {
    cmsPage = await cmsService.getPage('features')
  } catch (error) {
    console.error('Failed to fetch features page from CMS', error)
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
