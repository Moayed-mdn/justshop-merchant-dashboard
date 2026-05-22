'use client'

import { cn } from '@/lib/utils'
import SectionContainer from '@/features/marketing/layouts/SectionContainer'
import SectionHeading from '@/features/marketing/components/SectionHeading'
import FeatureCard from '@/features/marketing/components/FeatureCard'
import { CmsFeatureGroup } from '@/types/cms'
import { useTranslations } from 'next-intl'

interface FeatureGroupsSectionProps {
  groups: CmsFeatureGroup[]
  heading?: string
}

export default function FeatureGroupsSection({
  groups,
  heading,
}: FeatureGroupsSectionProps) {
  const t = useTranslations('marketing.sections.features')

  return (
    <section className="w-full py-20 sm:py-28">
      <SectionContainer>
        <SectionHeading
          heading={heading || t('heading')}
          align="center"
        />

        <div className="mt-20 space-y-24">
          {groups.map((group, groupIdx) => (
            <div key={groupIdx}>
              <h3 className="mb-10 text-2xl font-bold tracking-tight text-foreground">
                {group.title}
              </h3>
              <div
                className={cn(
                  'grid grid-cols-1 gap-6',
                  'sm:grid-cols-2 lg:grid-cols-3',
                )}
              >
                {group.features.map((feature, featureIdx) => (
                  <FeatureCard
                    key={featureIdx}
                    icon="CheckCircle2" // Default icon for features
                    title={feature.title}
                    description={feature.desc}
                    className="h-full"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>
    </section>
  )
}
