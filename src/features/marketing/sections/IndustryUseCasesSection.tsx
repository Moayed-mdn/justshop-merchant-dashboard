import SectionContainer from '@/features/marketing/layouts/SectionContainer'
import SectionHeading from '@/features/marketing/components/SectionHeading'
import type { IndustryUseCaseItem } from '@/features/marketing/types'

interface IndustryUseCasesSectionProps {
  heading: string
  useCases: IndustryUseCaseItem[]
}

export default function IndustryUseCasesSection({
  heading,
  useCases = [],
}: IndustryUseCasesSectionProps) {
  return (
    <section className="py-24 sm:py-32 bg-background">
      <SectionContainer>
        <SectionHeading
          heading={heading}
          align="center"
          className="mb-16"
        />

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {useCases?.map((useCase, index) => (
            <div
              key={index}
              className="flex flex-col rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-2xl">
                {useCase.icon}
              </div>
              <h3 className="mb-3 text-xl font-bold text-foreground">
                {useCase.industry}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </SectionContainer>
    </section>
  )
}
