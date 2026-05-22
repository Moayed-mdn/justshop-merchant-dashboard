import { cn } from '@/lib/utils'
import SectionContainer from '@/features/marketing/layouts/SectionContainer'
import SectionHeading from '@/features/marketing/components/SectionHeading'
import { CmsCategory } from '@/types/cms'

interface CategoryGridSectionProps {
  categories: string[] | CmsCategory[]
  heading?: string
}

export default function CategoryGridSection({
  categories,
  heading = 'Explore Categories',
}: CategoryGridSectionProps) {
  if (!categories || categories.length === 0) return null

  return (
    <section className="w-full py-20 sm:py-28">
      <SectionContainer>
        <SectionHeading
          heading={heading}
          align="center"
        />

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, idx) => {
            const isString = typeof category === 'string'
            const title = isString ? category : category.title
            const description = isString ? null : category.desc

            return (
              <div
                key={idx}
                className={cn(
                  'group relative flex flex-col p-8 rounded-3xl border border-border bg-card',
                  'transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
                )}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <span className="text-xl font-bold">{idx + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
                {description && (
                  <p className="text-muted-foreground leading-relaxed">{description}</p>
                )}
                <div className="mt-6 flex items-center text-sm font-semibold text-primary">
                  <span>View content</span>
                  <svg
                    className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            )
          })}
        </div>
      </SectionContainer>
    </section>
  )
}
