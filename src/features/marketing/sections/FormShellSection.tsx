import { Link } from '@/lib/navigation'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import SectionHeading from '@/features/marketing/components/SectionHeading'
import SplitLayout from '@/features/marketing/layouts/SplitLayout'
import type { FormShellContent } from '@/features/marketing/types'

interface FormShellSectionProps {
  content: FormShellContent
  className?: string
}

export default function FormShellSection({
  content,
  className,
}: FormShellSectionProps) {
  return (
    <section className={cn('w-full py-20 sm:py-28', className)}>
      <SplitLayout
        left={
          <div className="space-y-8">
            <SectionHeading
              as="h2"
              heading={content.heading}
              eyebrow={content.eyebrow}
              subtext={content.subtitle}
              align="left"
            />

            <div className="rounded-2xl border border-border bg-card/70 p-6 shadow-sm">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {content.note}
              </p>

              {(content.primaryCta || content.secondaryCta) && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {content.primaryCta && (
                    <Link
                      href={content.primaryCta.href}
                      className={cn(
                        'inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5',
                        'text-sm font-semibold text-primary-foreground transition-colors duration-150',
                        'hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2',
                        'focus-visible:ring-ring focus-visible:ring-offset-2',
                      )}
                    >
                      {content.primaryCta.label}
                    </Link>
                  )}

                  {content.secondaryCta && (
                    <Link
                      href={content.secondaryCta.href}
                      className={cn(
                        'inline-flex items-center justify-center rounded-lg border border-border',
                        'bg-background px-5 py-2.5 text-sm font-semibold text-foreground',
                        'transition-colors duration-150 hover:bg-muted focus-visible:outline-none',
                        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                      )}
                    >
                      {content.secondaryCta.label}
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        }
        right={
          <div
            className={cn(
              'rounded-2xl border border-border bg-card/80 p-6 shadow-sm sm:p-8',
            )}
          >
            <form className="space-y-5" aria-label={content.heading}>
              {content.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id}>{field.label}</Label>

                  {field.type === 'textarea' ? (
                    <Textarea
                      id={field.id}
                      name={field.id}
                      placeholder={field.placeholder}
                      className="min-h-28"
                    />
                  ) : (
                    <Input
                      id={field.id}
                      name={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      className="h-11 px-3"
                    />
                  )}
                </div>
              ))}

              <button
                type="button"
                className={cn(
                  'inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary',
                  'px-4 text-sm font-semibold text-primary-foreground transition-colors duration-150',
                  'hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2',
                  'focus-visible:ring-ring focus-visible:ring-offset-2',
                )}
              >
                {content.formCtaLabel}
              </button>

              <p className="text-xs leading-relaxed text-muted-foreground">
                {content.formHelper}
              </p>
            </form>
          </div>
        }
      />
    </section>
  )
}
