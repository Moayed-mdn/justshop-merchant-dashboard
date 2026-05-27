'use client';

/**
 * Topbar component.
 * Header bar with mobile menu toggle, theme/locale toggles, and user menu.
 *
 * Reason for 'use client': needs Zustand state for sidebar toggle.
 */

import { useUiStore, selectSidebarOpen, selectSidebarCollapsed } from '@/stores/uiStore';
import { UserMenu } from './UserMenu';
import { StoreSwitcher } from './StoreSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { LocaleToggle } from './LocaleToggle';
import { Button } from '@/components/ui/button';
import { Menu, PanelLeftOpen, PanelLeftClose, Search, Bell } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Separator } from '@/components/ui/separator';
import { FEATURES } from '@/config/features';

interface TopbarProps {
  switcher?: React.ReactNode;
}

/**
 * Top header bar component.
 */
export function Topbar({ switcher }: TopbarProps) {
  const sidebarOpen      = useUiStore(selectSidebarOpen);
  const sidebarCollapsed = useUiStore(selectSidebarCollapsed);
  const setSidebarOpen   = useUiStore((state) => state.setSidebarOpen);
  const toggleSidebar    = useUiStore((state) => state.toggleSidebar);
  const t = useTranslations('nav');

  return (
    <header className="flex h-14 items-center gap-4 border-b border-border bg-background px-4">
      {/* Mobile — opens the sheet overlay */}
      <Button
        variant="ghost"
        size="icon"
        type="button"
        className="md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label={t('toggleMenu')}
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </Button>

      {/* Desktop — re-expands/collapses the sidebar */}
      <Button
        variant="ghost"
        size="icon"
        type="button"
        className="hidden md:flex"
        onClick={toggleSidebar}
        aria-label={t('toggleSidebar')}
      >
        {sidebarCollapsed ? (
          <PanelLeftOpen className="h-5 w-5" aria-hidden="true" />
        ) : (
          <PanelLeftClose className="h-5 w-5" aria-hidden="true" />
        )}
      </Button>

      {/* Search placeholder */}
      <div className="hidden md:flex flex-1 max-w-md relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <div className="h-9 w-full rounded-md border border-input bg-muted/50 px-9 py-2 text-sm text-muted-foreground cursor-not-allowed">
          Search products, orders...
        </div>
      </div>

      {/* Spacer for mobile */}
      <div className="flex-1 md:hidden" />

      {/* Right side controls */}
      <div className="flex items-center gap-2">
        {switcher || <StoreSwitcher />}

        <Separator orientation="vertical" className="mx-1 h-6 hidden md:block" />

        <Button variant="ghost" size="icon" className="relative hidden md:flex" disabled>
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
        </Button>

        {FEATURES.enableDarkMode && <ThemeToggle />}
        {FEATURES.enableRTL && <LocaleToggle />}
        <Separator orientation="vertical" className="h-6" />
        <UserMenu />
      </div>
    </header>
  );
}
