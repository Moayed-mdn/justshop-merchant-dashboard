'use client'

import { useLocale } from 'next-intl'
import { Link, usePathname } from '@/lib/navigation'
import { cn } from '@/lib/utils'

export default function LocaleSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-4">
      <Link
        href={pathname}
        locale="en"
        className={cn(
          'text-xs text-muted-foreground transition-colors hover:text-foreground',
          locale === 'en' && 'font-semibold text-foreground',
        )}
        aria-label="Switch to English"
      >
        EN
      </Link>
      <Link
        href={pathname}
        locale="ar"
        className={cn(
          'text-xs text-muted-foreground transition-colors hover:text-foreground',
          locale === 'ar' && 'font-semibold text-foreground',
        )}
        aria-label="التبديل إلى العربية"
      >
        AR
      </Link>
    </div>
  )
}
