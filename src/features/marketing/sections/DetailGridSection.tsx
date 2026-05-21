import { cn } from '@/lib/utils'
import SectionContainer from '@/features/marketing/layouts/SectionContainer'
import SectionHeading from '@/features/marketing/components/SectionHeading'
import type { HighlightItem } from '@/features/marketing/types'

interface DetailGridSectionProps {
  heading: string
  eyebrow?: string
  subtitle?: string
  items: HighlightItem[]
  className?: string
  columns?: 2 | 3 | 4
}

const COLUMN_CLASSES: Record<NonNullable<DetailGridSectionProps['columns']>, string> = {
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'xl:grid-cols-4',
}

export default function DetailGridSection({
  heading,
  eyebrow,
  subtitle,
  items,
  className,
  columns = 2,
}: DetailGridSectionProps) {
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

        <div
          className={cn(
            'mt-16 grid grid-cols-1 gap-6 md:grid-cols-2',
            COLUMN_CLASSES[columns],
          )}
        >
          {items.map((item) => (
            <article
              key={item.id}
              className={cn(
                'flex h-full flex-col rounded-2xl border border-border bg-card/80 p-6',
                'shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg',
              )}
            >
              {item.eyebrow && (
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  {item.eyebrow}
                </p>
              )}

              <h3 className={cn('mt-3 text-xl font-semibold text-foreground')}>
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {item.description}
              </p>

              {item.points && item.points.length > 0 && (
                <ul className="mt-5 space-y-3">
                  {item.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 h-2 w-2 rounded-full bg-primary/70"
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </SectionContainer>
    </section>
  )
}
