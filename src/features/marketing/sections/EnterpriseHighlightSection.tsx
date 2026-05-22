import { cn } from '@/lib/utils'
import SectionContainer from '@/features/marketing/layouts/SectionContainer'
import SectionHeading from '@/features/marketing/components/SectionHeading'
import { CmsEnterpriseHighlight } from '@/types/cms'

interface EnterpriseHighlightSectionProps {
  data: CmsEnterpriseHighlight
  className?: string
}

export default function EnterpriseHighlightSection({
  data,
  className,
}: EnterpriseHighlightSectionProps) {
  return (
    <section className={cn('w-full py-16 sm:py-24', className)}>
      <SectionContainer>
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeading
            heading={data.title}
            subtext={data.content}
            align="center"
          />
        </div>
      </SectionContainer>
    </section>
  )
}
