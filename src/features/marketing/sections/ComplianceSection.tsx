import { cn } from '@/lib/utils'
import SectionContainer from '@/features/marketing/layouts/SectionContainer'
import SectionHeading from '@/features/marketing/components/SectionHeading'
import { CmsComplianceSection } from '@/types/cms'

interface ComplianceSectionProps {
  data: CmsComplianceSection
}

export default function ComplianceSection({ data }: ComplianceSectionProps) {
  return (
    <section className="w-full py-16 sm:py-24 bg-muted/20">
      <SectionContainer>
        <div className="flex flex-col items-center text-center">
          <SectionHeading
            heading={data.title}
            align="center"
          />

          <div className="mt-12 flex flex-wrap justify-center gap-8 md:gap-12">
            {data.badges.map((badge, idx) => (
              <div
                key={idx}
                className={cn(
                  'flex h-24 w-36 items-center justify-center rounded-xl border border-border',
                  'bg-card text-lg font-bold tracking-tighter text-muted-foreground shadow-sm',
                )}
              >
                {badge}
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>
    </section>
  )
}
