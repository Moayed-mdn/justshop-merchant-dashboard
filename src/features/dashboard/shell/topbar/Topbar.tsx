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
import { Menu, PanelLeftOpen, PanelLeftClose } from 'lucide-react';
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

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right side controls */}
      <div className="flex items-center gap-2">
        {switcher || <StoreSwitcher />}

        <Separator orientation="vertical" className="mx-1 h-6 hidden md:block" />

        {FEATURES.enableDarkMode && <ThemeToggle />}
        {FEATURES.enableRTL && <LocaleToggle />}
        <Separator orientation="vertical" className="h-6" />
        <UserMenu />
      </div>
    </header>
  );
}
