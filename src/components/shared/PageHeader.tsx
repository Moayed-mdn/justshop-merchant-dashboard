'use client';

/**
 * Page Header Component (Shopify-style).
 * Consistent header with breadcrumbs, title, and primary actions.
 */

import { Breadcrumbs } from './Breadcrumbs';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  tabs?: React.ReactNode;
  className?: string;
  showBreadcrumbs?: boolean;
}

export function PageHeader({
  title,
  description,
  actions,
  tabs,
  className,
  showBreadcrumbs = true,
}: PageHeaderProps) {
  return (
    <div className={cn('space-y-4 mb-6', className)}>
      {/* Breadcrumbs */}
      {showBreadcrumbs && <Breadcrumbs />}

      {/* Title and Actions */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>

      {/* Tabs */}
      {tabs && <div className="border-b">{tabs}</div>}
    </div>
  );
}
