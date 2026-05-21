import { Link } from '@/lib/navigation'
import { cn } from '@/lib/utils'
import SectionContainer from '@/features/marketing/layouts/SectionContainer'
import SectionHeading from '@/features/marketing/components/SectionHeading'
import type { ActionCardItem } from '@/features/marketing/types'

interface ActionCardSectionProps {
  heading: string
  eyebrow?: string
  subtitle?: string
  items: ActionCardItem[]
  className?: string
  columns?: 2 | 3 | 4
}

const COLUMN_CLASSES: Record<NonNullable<ActionCardSectionProps['columns']>, string> = {
  2: 'lg:grid-cols-2',
  3: 'xl:grid-cols-3',
  4: 'xl:grid-cols-4',
}

function isExternalHref(href: string): boolean {
  return href.startsWith('mailto:') || href.startsWith('http://') || href.startsWith('https://')
}

export default function ActionCardSection({
  heading,
  eyebrow,
  subtitle,
  items,
  className,
  columns = 3,
}: ActionCardSectionProps) {
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
                'group flex h-full flex-col rounded-2xl border border-border bg-card/80 p-6',
                'shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg',
              )}
            >
              <div
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10',
                  'text-lg text-primary transition-colors duration-200 group-hover:bg-primary/15',
                )}
                aria-hidden="true"
              >
                <span>{item.icon}</span>
              </div>

              {item.eyebrow && (
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  {item.eyebrow}
                </p>
              )}

              <h3 className="mt-3 text-xl font-semibold text-foreground">
                {item.title}
              </h3>

              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {item.description}
              </p>

              <div className="mt-6">
                {isExternalHref(item.href) ? (
                  <a
                    href={item.href}
                    className={cn(
                      'inline-flex items-center gap-2 text-sm font-semibold text-foreground',
                      'transition-colors duration-150 hover:text-primary',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      'focus-visible:ring-offset-2',
                    )}
                  >
                    <span>{item.ctaLabel}</span>
                    <span aria-hidden="true">{'->'}</span>
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      'inline-flex items-center gap-2 text-sm font-semibold text-foreground',
                      'transition-colors duration-150 hover:text-primary',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      'focus-visible:ring-offset-2',
                    )}
                  >
                    <span>{item.ctaLabel}</span>
                    <span aria-hidden="true">{'->'}</span>
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </SectionContainer>
    </section>
  )
}
