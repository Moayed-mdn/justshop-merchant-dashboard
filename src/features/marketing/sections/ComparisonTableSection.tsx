'use client'

import { cn } from '@/lib/utils'
import SectionContainer from '@/features/marketing/layouts/SectionContainer'
import SectionHeading from '@/features/marketing/components/SectionHeading'
import { CmsComparisonTable } from '@/types/cms'
import { useTranslations } from 'next-intl'

interface ComparisonTableSectionProps {
  data: CmsComparisonTable
  heading?: string
}

export default function ComparisonTableSection({
  data,
  heading,
}: ComparisonTableSectionProps) {
  const t = useTranslations('marketing.sections.pricing')

  return (
    <section className="w-full py-20 sm:py-28 bg-muted/20">
      <SectionContainer>
        <SectionHeading
          heading={heading || t('compare_plans_heading')}
          align="center"
        />

        <div className="mt-16 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border">
                {data.headers.map((header: string, i: number) => (
                  <th
                    key={i}
                    className={cn(
                      'py-4 px-6 text-sm font-semibold text-foreground',
                      i === 0 ? 'text-left' : 'text-center'
                    )}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row: string[], rowIndex: number) => (
                <tr
                  key={rowIndex}
                  className="border-b border-border transition-colors hover:bg-muted/50"
                >
                  {row.map((cell: string, cellIndex: number) => (
                    <td
                      key={cellIndex}
                      className={cn(
                        'py-4 px-6 text-sm text-muted-foreground',
                        cellIndex === 0 ? 'font-medium text-foreground' : 'text-center'
                      )}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionContainer>
    </section>
  )
}
