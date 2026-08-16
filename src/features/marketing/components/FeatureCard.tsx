// =============================================================================
// FeatureCard
//
// Displays a single feature item: icon, title, description.
// Used in FeatureGridSection.
//
// Rules:
//   - Server Component — purely presentational
//   - no data fetching, no translation calls
//   - all content via typed props
//   - icon can be: Lucide icon name, image URL, or emoji
//   - hover state uses CSS transition only, no JS
// =============================================================================

import { cn } from '@/lib/utils'
import { IconOrImage } from '@/components/media/IconOrImage'
import type { FeatureItem } from '@/features/marketing/types'

type FeatureCardProps = Pick<FeatureItem, 'icon' | 'title' | 'description'> & {
  className?: string
}

export default function FeatureCard({
  icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        'group flex flex-col gap-4 rounded-xl border border-border bg-card p-6',
        'transition-shadow duration-200 hover:shadow-md',
        className,
      )}
    >
      {/* Icon container */}
      <div
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-lg',
          'bg-primary/10 text-primary',
          'transition-colors duration-200 group-hover:bg-primary/15',
        )}
        aria-hidden="true"
      >
        <IconOrImage 
          value={icon} 
          className="h-6 w-6" 
          imageClassName="h-6 w-6 object-contain"
          alt=""
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  )
}
