import { cn } from '@/lib/utils'
import SectionContainer from '@/features/marketing/layouts/SectionContainer'
import SectionHeading from '@/features/marketing/components/SectionHeading'
import type { ProductWalkthroughContent } from '@/features/marketing/types'

export default function ProductWalkthroughSection({
  heading,
  steps = [],
}: ProductWalkthroughContent) {
  return (
    <section className="py-24 sm:py-32 bg-background">
      <SectionContainer>
        <SectionHeading
          heading={heading}
          align="center"
          className="mb-16"
        />

        <div className="grid gap-12 lg:gap-24">
          {steps?.map((step, index) => (
            <div
              key={index}
              className={cn(
                'flex flex-col gap-8 lg:flex-row lg:items-center',
                index % 2 === 1 && 'lg:flex-row-reverse'
              )}
            >
              <div className="flex-1 space-y-4">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                  {index + 1}
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {step.title}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
              <div className="flex-1">
                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl transition-all hover:shadow-2xl">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="aspect-video w-full object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>
    </section>
  )
}
