'use client'

import { cn } from '@/lib/utils'
import SectionContainer from '@/features/marketing/layouts/SectionContainer'
import SectionHeading from '@/features/marketing/components/SectionHeading'
import { CmsIntegration } from '@/types/cms'
import { useTranslations } from 'next-intl'

interface IntegrationsSectionProps {
  integrations: CmsIntegration[]
  heading?: string
  subtitle?: string
}

export default function IntegrationsSection({
  integrations,
  heading,
  subtitle,
}: IntegrationsSectionProps) {
  const t = useTranslations('marketing.sections.integrations')
  
  return (
    <section className="w-full py-20 sm:py-28 bg-muted/20">
      <SectionContainer>
        <SectionHeading
          heading={heading || t('heading')}
          subtext={subtitle || t('subtext')}
          align="center"
        />

        <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
          {integrations.map((integration, idx) => (
            <div
              key={idx}
              className={cn(
                'flex flex-col items-center justify-center rounded-2xl border border-border',
                'bg-card p-8 shadow-sm transition-all duration-200 hover:shadow-md',
              )}
            >
              <div className="mb-4 h-12 w-12 rounded-lg bg-primary/5 flex items-center justify-center">
                 {/* Placeholder for real logo rendering */}
                 <span className="text-xs font-bold text-primary uppercase">{integration.logo}</span>
              </div>
              <p className="font-semibold text-foreground">{integration.name}</p>
            </div>
          ))}
        </div>
      </SectionContainer>
    </section>
  )
}
