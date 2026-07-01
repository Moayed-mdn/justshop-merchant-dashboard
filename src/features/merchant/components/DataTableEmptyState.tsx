'use client';

import { Button } from '@/components/ui/button';
import { Link } from '@/lib/navigation';
import { useTranslations } from 'next-intl';
import type { LucideIcon } from 'lucide-react';

interface DataTableEmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  explanation?: string;
  actionLabel?: string;
  actionHref?: string;
}

/**
 * Empty state for data tables with no rows.
 * Provides contextual icon, explanation, and optional create action.
 */
export function DataTableEmptyState({
  icon: Icon,
  title,
  explanation,
  actionLabel,
  actionHref,
}: DataTableEmptyStateProps) {
  const t = useTranslations('nav');
  const resolvedTitle = title ?? t('noDataYet');
  const resolvedExplanation = explanation ?? t('itemsWillAppearHere');
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-12 text-center">
      {Icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      <h3 className="mt-4 text-base font-semibold">{resolvedTitle}</h3>
      <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
        {resolvedExplanation}
      </p>
      {actionLabel && actionHref && (
        <div className="mt-5">
          <Link href={actionHref}>
            <Button variant="default" size="sm">
              {actionLabel}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
