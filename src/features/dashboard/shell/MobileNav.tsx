'use client';

/**
 * MobileNav component.
 * Mobile navigation overlay using Sheet component.
 * 
 * Reason for 'use client': reads sidebar state from Zustand.
 */

import { useUiStore, selectSidebarOpen, selectIsRTL } from '@/stores/uiStore';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { SidebarNav } from './sidebar/SidebarNav';
import { useTranslations } from 'next-intl';
import React from 'react';

interface MobileNavProps {
  nav?: React.ReactNode;
}

/**
 * Mobile navigation sheet that overlays on small screens.
 * Accepts the same nav slot as the desktop Sidebar so both render
 * the same navigation tree regardless of route shape.
 */
export function MobileNav({ nav }: MobileNavProps) {
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const sidebarOpen = useUiStore(selectSidebarOpen);
  const isRTL = useUiStore(selectIsRTL);
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);
  const t = useTranslations('nav');

  return (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetContent side={isRTL ? 'right' : 'left'} className="w-60 p-0 bg-sidebar">
        <div className="flex h-14 items-center border-b border-sidebar-border px-4">
          <span className="text-sm font-semibold text-sidebar-foreground">
            {t('appName')}
          </span>
        </div>
        {nav ? (
          React.isValidElement(nav) ? React.cloneElement(nav, { isCollapsed: false } as any) : nav
        ) : (
          activeStore ? <SidebarNav storeId={String(activeStore.id)} isCollapsed={false} /> : null
        )}
      </SheetContent>
    </Sheet>
  );
}
