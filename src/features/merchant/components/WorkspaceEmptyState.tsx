'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';
import { Link } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { Store } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface WorkspaceEmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: LucideIcon;
}

/**
 * Workspace Empty State.
 * Used when no active store is selected or a section has no data.
 */
export function WorkspaceEmptyState({
  title = 'No active store selected',
  message = 'Please select a store from the switcher or go to the stores list to manage your businesses.',
  actionLabel = 'View all stores',
  actionHref = ROUTES.merchant.stores.list(),
  icon: Icon = Store,
}: WorkspaceEmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in zoom-in duration-300">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mt-6 text-lg font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        {message}
      </p>
      <div className="mt-6">
        <Link 
          href={actionHref} 
          className={cn(buttonVariants({ variant: 'default' }))}
        >
          {actionLabel}
        </Link>
      </div>
    </div>
  );
}
