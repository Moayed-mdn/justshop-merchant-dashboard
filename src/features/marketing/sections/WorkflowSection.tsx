import { cn } from '@/lib/utils'
import SectionContainer from '@/features/marketing/layouts/SectionContainer'
import SectionHeading from '@/features/marketing/components/SectionHeading'
import type { WorkflowStep } from '@/features/marketing/types'

interface WorkflowSectionProps {
  heading: string
  eyebrow?: string
  subtitle?: string
  steps: WorkflowStep[]
  className?: string
}

export default function WorkflowSection({
  heading,
  eyebrow,
  subtitle,
  steps,
  className,
}: WorkflowSectionProps) {
  return (
    <section className={cn('w-full py-20 sm:py-28', className)}>
      <SectionContainer>
        <SectionHeading
          as="h2"
          heading={heading}
          eyebrow={eyebrow}
          subtext={subtitle}
          align="center"
        />

        <ol className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.id} className="h-full">
              <article
                className={cn(
                  'flex h-full flex-col rounded-2xl border border-border bg-card/80 p-6',
                  'shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg',
                )}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={cn(
                      'flex h-11 w-11 items-center justify-center rounded-full',
                      'bg-primary/10 text-sm font-semibold text-primary',
                    )}
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="h-px flex-1 bg-border" aria-hidden="true" />
                </div>

                <h3 className="mt-6 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {step.description}
                </p>
              </article>
            </li>
          ))}
        </ol>
      </SectionContainer>
    </section>
  )
}
