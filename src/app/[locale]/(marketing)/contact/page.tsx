import { getTranslations, getLocale } from 'next-intl/server'
import type { Metadata } from 'next'

import { buildPageMetadata } from '@/features/marketing/lib/seo'
import {
  getContactCTAContent,
  getContactFormShellContent,
  getContactHeroContent,
  getContactMethodCards,
  getContactResourceShellContent,
  getContactStats,
} from '@/features/marketing/content/contact/page-content'

import HeroSection from '@/features/marketing/sections/HeroSection'
import StatsSection from '@/features/marketing/sections/StatsSection'
import ActionCardSection from '@/features/marketing/sections/ActionCardSection'
import FormShellSection from '@/features/marketing/sections/FormShellSection'
import ResourceShellSection from '@/features/marketing/sections/ResourceShellSection'
import CTASection from '@/features/marketing/sections/CTASection'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('marketing')
  const locale = await getLocale()

  return buildPageMetadata({
    locale,
    title: t('meta.contact.title'),
    description: t('meta.contact.description'),
    path: '/contact',
  })
}

export default async function ContactPage() {
  const t = await getTranslations('marketing')

  const hero = getContactHeroContent(t)
  const stats = getContactStats(t)
  const methods = getContactMethodCards(t)
  const form = getContactFormShellContent(t)
  const shortcuts = getContactResourceShellContent(t)
  const cta = getContactCTAContent(t)

  return (
    <>
      <HeroSection {...hero} />

      <StatsSection items={stats} />

      <ActionCardSection
        heading={t('contactPage.methods.heading')}
        eyebrow={t('contactPage.methods.eyebrow')}
        subtitle={t('contactPage.methods.subtitle')}
        items={methods}
        columns={3}
      />

      <FormShellSection content={form} className="bg-muted/20" />

      <ResourceShellSection content={shortcuts} />

      <CTASection {...cta} />
    </>
  )
}
