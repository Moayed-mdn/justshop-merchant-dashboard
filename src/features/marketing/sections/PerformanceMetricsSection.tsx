import SectionContainer from '@/features/marketing/layouts/SectionContainer'
import SectionHeading from '@/features/marketing/components/SectionHeading'
import type { PerformanceMetricsContent } from '@/features/marketing/types'

export default function PerformanceMetricsSection({
  heading,
  metrics = [],
}: PerformanceMetricsContent) {
  return (
    <section className="py-24 sm:py-32 bg-primary text-primary-foreground">
      <SectionContainer>
        <SectionHeading
          heading={heading}
          align="center"
          className="mb-16"
          // Invert colors for dark background
          headingClassName="text-primary-foreground"
          subtextClassName="text-primary-foreground/80"
        />

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {metrics?.map((metric, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center space-y-2"
            >
              <div className="text-5xl font-extrabold tracking-tight sm:text-6xl">
                {metric.value}
              </div>
              <div className="text-xl font-bold">
                {metric.label}
              </div>
              <div className="text-sm text-primary-foreground/70">
                {metric.subtext}
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>
    </section>
  )
}
