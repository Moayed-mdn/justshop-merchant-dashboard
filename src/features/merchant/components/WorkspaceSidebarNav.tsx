'use client';

import { usePathname } from '@/lib/navigation';
import { useCan } from '@/stores/bootstrapStore';
import { useUiStore, selectSidebarCollapsed } from '@/stores/uiStore';
import { SidebarNavItem } from '@/features/dashboard/shell/sidebar/SidebarNavItem';
import { ROUTES } from '@/config/routes';
import { useTranslations } from 'next-intl';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Store,
  LayoutGrid,
  Bookmark,
  Tag,
  Users,
  Settings,
  FileText,
  type LucideIcon,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  show: boolean;
  exact?: boolean;
}

/**
 * Merchant Workspace Sidebar Navigation.
 * Renders navigation items for the multi-store workspace shell.
 */
export function WorkspaceSidebarNav({ isCollapsed: isCollapsedProp }: { isCollapsed?: boolean }) {
  const pathname    = usePathname();
  const isCollapsedFromStore = useUiStore(selectSidebarCollapsed);
  const isCollapsed = isCollapsedProp !== undefined ? isCollapsedProp : isCollapsedFromStore;
  const t           = useTranslations('nav');

  // Permission checks
  const canViewDashboard  = useCan('canViewDashboard');
  const canManageStores   = true; // Merchants can always see their stores list
  const canManageOrders   = useCan('canManageOrders');
  const canManageProducts = useCan('canManageProducts');
  const canManageCategories = useCan('canManageCategories');
  const canManageBrands   = useCan('canManageBrands');
  const canManageTags     = useCan('canManageTags');
  const canManageUsers    = useCan('canManageUsers');
  const canManageCmsPages = useCan('canManageCmsPages');

  const navItems: NavItem[] = [
    {
      label: t('dashboard'),
      href:  ROUTES.merchant.dashboard(),
      icon:  LayoutDashboard,
      show:  canViewDashboard,
      exact: true,
    },
    {
      label: t('orders'),
      href:  ROUTES.merchant.orders(),
      icon:  ShoppingCart,
      show:  canManageOrders,
    },
    {
      label: t('products'),
      href:  ROUTES.merchant.products.list(),
      icon:  Package,
      show:  canManageProducts,
    },
    {
      label: t('categories'),
      href:  ROUTES.merchant.categories.list(),
      icon:  LayoutGrid,
      show:  canManageCategories,
    },
    {
      label: t('brands'),
      href:  ROUTES.merchant.brands(),
      icon:  Bookmark,
      show:  canManageBrands,
    },
    {
      label: t('tags'),
      href:  ROUTES.merchant.tags(),
      icon:  Tag,
      show:  canManageTags,
    },
    {
      label: t('cmsPages'),
      href:  ROUTES.merchant.cmsPages(),
      icon:  FileText,
      show:  canManageCmsPages,
    },
    {
      label: t('users'),
      href:  ROUTES.merchant.customers(),
      icon:  Users,
      show:  canManageUsers,
    },
    {
      label: t('stores'),
      href:  ROUTES.merchant.stores.list(),
      icon:  Store,
      show:  canManageStores,
    },
    {
      label: t('settings'),
      href:  ROUTES.merchant.settings(),
      icon:  Settings,
      show:  true,
    },
  ];

  const visibleItems = navItems.filter((item) => item.show);

  return (
    <nav aria-label={t('mainNav')} className="flex-1 overflow-y-auto px-2 py-4">
      <ul role="list" className="space-y-1">
        {visibleItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <SidebarNavItem
              key={item.href}
              label={item.label}
              href={item.href}
              icon={item.icon}
              isCollapsed={isCollapsed}
              isActive={isActive}
            />
          );
        })}
      </ul>
    </nav>
  );
}
