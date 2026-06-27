'use client';

/**
 * Sidebar Navigation Group Component.
 * Groups related navigation items with a section header (Shopify-style).
 */

import { cn } from '@/lib/utils';

interface SidebarNavGroupProps {
  title: string;
  children: React.ReactNode;
  isCollapsed: boolean;
}

export function SidebarNavGroup({ title, children, isCollapsed }: SidebarNavGroupProps) {
  if (isCollapsed) {
    return (
      <>
        {/* Divider line when collapsed */}
        <li className="my-2">
          <div className="mx-3 border-t border-sidebar-border" />
        </li>
        {children}
      </>
    );
  }

  return (
    <>
      {/* Section Header */}
      <li className="px-3 py-2 mt-4 first:mt-0">
        <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
          {title}
        </h3>
      </li>
      {children}
    </>
  );
}
