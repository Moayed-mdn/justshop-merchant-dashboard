'use client'

import SectionContainer from '@/features/marketing/layouts/SectionContainer'
import SectionHeading from '@/features/marketing/components/SectionHeading'
import type { CmsCaseStudy } from '@/types/cms'
import { useTranslations } from 'next-intl'

interface CaseStudiesSectionProps {
  studies: CmsCaseStudy[]
  heading?: string
}

export default function CaseStudiesSection({
  studies,
  heading,
}: CaseStudiesSectionProps) {
  const t = useTranslations('marketing.sections.enterprise')

  return (
    <section className="w-full py-20 sm:py-28 bg-primary text-primary-foreground">
      <SectionContainer>
        <SectionHeading
          heading={heading || t('success_stories_heading')}
          align="center"
          className="text-primary-foreground"
        />

        <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-2">
          {studies.map((study, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 border border-white/10"
            >
              <p className="text-3xl font-bold tracking-tight mb-4">{study.result}</p>
              <div className="h-px w-12 bg-white/20 mb-4" />
              <p className="text-lg font-medium opacity-80">{study.client}</p>
            </div>
          ))}
        </div>
      </SectionContainer>
    </section>
  )
}
