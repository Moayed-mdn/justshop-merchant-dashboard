import SectionContainer from '@/features/marketing/layouts/SectionContainer'
import SectionHeading from '@/features/marketing/components/SectionHeading'
import { Link } from '@/lib/navigation'
import type { TemplateShowcaseContent } from '@/features/marketing/types'

export default function TemplateShowcaseSection({
  heading,
  subtitle,
  templates = [],
}: TemplateShowcaseContent) {
  return (
    <section className="py-24 sm:py-32 bg-muted/5">
      <SectionContainer>
        <SectionHeading
          heading={heading}
          subtext={subtitle}
          align="center"
          className="mb-16"
        />

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {templates?.map((template) => (
            <div
              key={template.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-lg"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-2">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {template.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {template.name}
                </h3>
                <div className="mt-auto pt-6">
                  <Link
                    href={template.demo_url}
                    className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
                  >
                    View Live Demo
                    <svg
                      className="ml-1 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>
    </section>
  )
}
