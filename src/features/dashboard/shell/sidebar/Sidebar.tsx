'use client';

/**
 * Sidebar component.
 * Fixed-width navigation sidebar with collapse functionality.
 * 
 * Reason for 'use client': needs Zustand state for collapse/expand.
 */

import { useUiStore, selectSidebarCollapsed } from '@/stores/uiStore';
import { useBootstrapStore, selectUser } from '@/stores/bootstrapStore';
import { SidebarNav } from './SidebarNav';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import React from 'react';

interface SidebarProps {
  nav?: React.ReactNode;
}

/**
 * Main sidebar component with navigation and user info.
 */
export function Sidebar({ nav }: SidebarProps) {
  const isCollapsed = useUiStore(selectSidebarCollapsed);
  const user = useBootstrapStore(selectUser);
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const t = useTranslations('nav');

  // Get user initials for avatar
  const getInitials = (name: string | null): string => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-200',
        'hidden md:flex',
        isCollapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Header section */}
      <div className="relative flex h-14 items-center px-3 border-b border-sidebar-border overflow-hidden">
        <div
          className={cn(
            'flex flex-col transition-all duration-300 ease-in-out whitespace-nowrap',
            isCollapsed ? 'opacity-0 translate-x-[-10px] pointer-events-none' : 'opacity-100 translate-x-0'
          )}
        >
          <span className="text-sm font-semibold">{t('appName')}</span>
          {activeStore ? (
            <span className="truncate text-xs text-sidebar-muted">{activeStore.name}</span>
          ) : null}
        </div>
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out',
            isCollapsed ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'
          )}
        >
          <span className="text-lg font-bold">{t('appName').charAt(0)}</span>
        </div>
      </div>

      {/* Navigation */}
      {nav ? (
        React.isValidElement(nav) ? React.cloneElement(nav, { isCollapsed } as any) : nav
      ) : (
        activeStore ? <SidebarNav isCollapsed={isCollapsed} /> : null
      )}

      {/* Footer section with user info */}
      <div className="mt-auto border-t border-sidebar-border p-3 overflow-hidden">
        <div
          className={cn(
            'flex items-center gap-3 transition-all duration-300 ease-in-out',
            isCollapsed ? 'justify-center' : 'justify-start'
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground text-xs font-medium">
            {getInitials(user?.name ?? null)}
          </div>
          <div
            className={cn(
              'flex flex-col overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap',
              isCollapsed ? 'w-0 opacity-0' : 'w-full opacity-100'
            )}
          >
            <span className="truncate text-sm font-medium">{user?.name}</span>
            <span className="truncate text-xs text-sidebar-muted">
              {t('user')}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
