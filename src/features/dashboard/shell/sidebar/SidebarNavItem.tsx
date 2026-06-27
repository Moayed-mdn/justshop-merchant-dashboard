'use client';

/**
 * SidebarNavItem component.
 * Individual navigation item with active state styling.
 * 
 * Reason for 'use client': uses Link and interactive state.
 */

import { Link } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import React from 'react';

interface SidebarNavItemProps {
  label: string;
  href: string;
  icon: LucideIcon;
  isCollapsed: boolean;
  isActive: boolean;
  children?: React.ReactNode;
}

/**
 * Single navigation item with icon and label.
 * Shows only icon when collapsed, with tooltip.
 * Supports children for badges or other indicators.
 */
export function SidebarNavItem({
  label,
  href,
  icon: Icon,
  isCollapsed,
  isActive,
  children,
}: SidebarNavItemProps) {
  return (
    <li className="relative">
      <Link
        href={href}
        aria-current={isActive ? 'page' : undefined}
        title={isCollapsed ? label : undefined}
        className={cn(
          'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out text-sidebar-accent-foreground overflow-hidden whitespace-nowrap',
          'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
          isActive && 'bg-sidebar-accent text-sidebar-accent-foreground',
          isCollapsed && 'justify-center px-2'
        )}
      >
        <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
        <span
          className={cn(
            'transition-all duration-300 ease-in-out truncate',
            isCollapsed ? 'w-0 opacity-0' : 'w-full opacity-100'
          )}
        >
          {label}
        </span>
        {!isCollapsed && children}
      </Link>
      {isCollapsed && children}
    </li>
  );
}
