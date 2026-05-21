import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import SectionContainer from '@/features/marketing/layouts/SectionContainer'
import SectionHeading from '@/features/marketing/components/SectionHeading'
import type { ResourceShellContent } from '@/features/marketing/types'

interface ResourceShellSectionProps {
  content: ResourceShellContent
  className?: string
}

export default function ResourceShellSection({
  content,
  className,
}: ResourceShellSectionProps) {
  return (
    <section className={cn('w-full py-20 sm:py-28', className)}>
      <SectionContainer>
        <SectionHeading
          as="h2"
          heading={content.heading}
          eyebrow={content.eyebrow}
          subtext={content.subtitle}
          align="center"
        />

        <div
          className={cn(
            'mt-16 grid grid-cols-1 gap-6 overflow-hidden rounded-3xl border border-border',
            'bg-card/80 p-4 shadow-sm lg:grid-cols-[280px_minmax(0,1fr)] lg:p-6',
          )}
        >
          <aside className="rounded-2xl border border-border bg-background/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {content.sidebarTitle}
            </p>

            <ul className="mt-5 space-y-3">
              {content.sidebarItems.map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-border/70 bg-card px-4 py-3 text-sm text-muted-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </aside>

          <div className="rounded-2xl border border-border bg-background/70 p-5 sm:p-6">
            <div className="border-b border-border pb-6">
              <label
                htmlFor="resource-shell-search"
                className="mb-3 block text-sm font-medium text-foreground"
              >
                {content.searchLabel}
              </label>
              <Input
                id="resource-shell-search"
                type="text"
                placeholder={content.searchPlaceholder}
                className="h-11 px-3"
              />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {content.cards.map((card) => (
                <article
                  key={card.id}
                  className="rounded-2xl border border-border bg-card/70 p-5 shadow-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    {card.meta}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold text-foreground">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {card.description}
                  </p>
                </article>
              ))}
            </div>

            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              {content.note}
            </p>
          </div>
        </div>
      </SectionContainer>
    </section>
  )
}
