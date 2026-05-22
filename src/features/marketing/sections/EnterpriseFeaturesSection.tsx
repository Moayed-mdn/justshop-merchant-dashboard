'use client'

import { cn } from '@/lib/utils'
import SectionContainer from '@/features/marketing/layouts/SectionContainer'
import SectionHeading from '@/features/marketing/components/SectionHeading'
import FeatureCard from '@/features/marketing/components/FeatureCard'
import { CmsFeatureItem } from '@/types/cms'
import { useTranslations } from 'next-intl'

interface EnterpriseFeaturesSectionProps {
  features: CmsFeatureItem[]
  heading?: string
}

export default function EnterpriseFeaturesSection({
  features,
  heading,
}: EnterpriseFeaturesSectionProps) {
  const t = useTranslations('marketing.sections.enterprise')

  return (
    <section className="w-full py-20 sm:py-28">
      <SectionContainer>
        <SectionHeading
          heading={heading || t('capabilities_heading')}
          align="center"
        />

        <div
          className={cn(
            'mt-16 grid grid-cols-1 gap-6',
            'sm:grid-cols-2 lg:grid-cols-3',
          )}
        >
          {features.map((feature, idx) => (
            <FeatureCard
              key={idx}
              icon="ShieldCheck"
              title={feature.title}
              description={feature.desc}
              className="h-full"
            />
          ))}
        </div>
      </SectionContainer>
    </section>
  )
}
