import { cn } from '@/lib/utils'
import SectionContainer from '@/features/marketing/layouts/SectionContainer'
import SectionHeading from '@/features/marketing/components/SectionHeading'
import { CmsSimpleSection } from '@/types/cms'

interface SimpleFeatureSectionProps {
  data: CmsSimpleSection
  className?: string
}

export default function SimpleFeatureSection({
  data,
  className,
}: SimpleFeatureSectionProps) {
  return (
    <section className={cn('w-full py-16 sm:py-24', className)}>
      <SectionContainer>
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading
            heading={data.title}
            subtext={data.desc}
            align="center"
          />
        </div>
      </SectionContainer>
    </section>
  )
}
