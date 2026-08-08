'use client';

import { usePathname } from '@/lib/navigation';
import { useCan } from '@/stores/bootstrapStore';
import { useUiStore, selectSidebarCollapsed } from '@/stores/uiStore';
import { useActivityStore, selectPendingOrders, selectDraftProducts } from '@/stores/activityStore';
import { SidebarNavItem } from '@/features/dashboard/shell/sidebar/SidebarNavItem';
import { SidebarNavGroup } from '@/features/dashboard/shell/sidebar/SidebarNavGroup';
import { ROUTES } from '@/config/routes';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
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
  Image,
  Palette,
  CreditCard,
  Menu,
  LayoutTemplate,
  Truck,
  Receipt,
  type LucideIcon,
} from 'lucide-react';
import React from 'react';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  show: boolean;
  exact?: boolean;
  badgeCount?: number;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

/**
 * Merchant Workspace Sidebar Navigation.
 * Renders navigation items for the multi-store workspace shell with grouped sections.
 * 
 * Heuristic 1: Visibility of System Status
 * - Shows activity badges for pending items
 */
export function WorkspaceSidebarNav({ isCollapsed: isCollapsedProp }: { isCollapsed?: boolean }) {
  const pathname    = usePathname();
  const isCollapsedFromStore = useUiStore(selectSidebarCollapsed);
  const isCollapsed = isCollapsedProp !== undefined ? isCollapsedProp : isCollapsedFromStore;
  const t           = useTranslations('nav');
  
  // Activity counts for badges
  const pendingOrders = useActivityStore(selectPendingOrders);
  const draftProducts = useActivityStore(selectDraftProducts);

  // Permission checks
  const canViewDashboard  = useCan('canViewDashboard');
  const canManageStores   = true;
  const canManageOrders   = useCan('canManageOrders');
  const canManageProducts = useCan('canManageProducts');
  const canManageCategories = useCan('canManageCategories');
  const canManageBrands   = useCan('canManageBrands');
  const canManageTags     = useCan('canManageTags');
  const canManageUsers    = useCan('canManageUsers');
  const canManageCmsPages = useCan('canManageCmsPages');
  const canManageThemes   = true;

  // Grouped navigation structure with badges - more intuitive grouping (Heuristic 2)
    const navGroups: NavGroup[] = [
      {
        title: t('groups.sales'),
        items: [
          {
            label: t('dashboard'),
            href:  ROUTES.merchant.dashboard(),
            icon:  LayoutDashboard,
            show:  canViewDashboard,
            exact: true,
          },
          {
            label: t('orders'),
            href:  ROUTES.merchant.orders.list(),
            icon:  ShoppingCart,
            show:  canManageOrders,
            badgeCount: pendingOrders,
          },
          {
            label: t('shipping'),
            href:  ROUTES.merchant.shipping(),
            icon:  Truck,
            show:  true,
          },
        ],
      },
      {
        title: t('groups.products'),
        items: [
          {
            label: t('products'),
            href:  ROUTES.merchant.products.list(),
            icon:  Package,
            show:  canManageProducts,
            badgeCount: draftProducts,
          },
          {
            label: t('categories'),
            href:  ROUTES.merchant.categories.list(),
            icon:  LayoutGrid,
            show:  canManageCategories,
          },
          {
            label: t('brands'),
            href:  ROUTES.merchant.brands.list(),
            icon:  Bookmark,
            show:  canManageBrands,
          },
          {
            label: t('tags'),
            href:  ROUTES.merchant.tags.list(),
            icon:  Tag,
            show:  canManageTags,
          },
        ],
      },
      {
        title: t('groups.storefront'),
        items: [
          {
            label: t('themes'),
            href:  ROUTES.merchant.theme.overview(),
            icon:  Palette,
            show:  canManageThemes,
          },
          {
            label: t('pages'),
            href:  ROUTES.merchant.cmsPages(),
            icon:  FileText,
            show:  canManageCmsPages,
          },
          {
            label: t('templates'),
            href:  ROUTES.merchant.templates.list(),
            icon:  LayoutTemplate,
            show:  canManageThemes,
          },
          {
            label: t('navigation'),
            href:  ROUTES.merchant.navigation.list(),
            icon:  Menu,
            show:  canManageThemes,
          },
        ],
      },
      {
        title: t('groups.customers'),
        items: [
          {
            label: t('customers'),
            href:  ROUTES.merchant.customers.list(),
            icon:  Users,
            show:  canManageUsers,
          },
        ],
      },
      {
        title: t('groups.billing'),
        items: [
          {
            label: t('billingAndPlan'),
            href:  ROUTES.merchant.billing.dashboard(),
            icon:  Receipt,
            show:  true,
          },
        ],
      },
    ];

  // Filter out empty groups
  const visibleGroups = navGroups
    .map(group => ({
      ...group,
      items: group.items.filter(item => item.show),
    }))
    .filter(group => group.items.length > 0);

  return (
    <nav aria-label={t('mainNav')} className="flex-1 overflow-y-auto px-2 py-4 flex flex-col">
      <ul role="list" className="space-y-1 flex-1">
        {visibleGroups.map((group) => (
          <SidebarNavGroup
            key={group.title}
            title={group.title}
            isCollapsed={isCollapsed}
          >
            {group.items.map((item) => {
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
                >
                  {/* Activity badge for visibility of system status */}
                  {typeof item.badgeCount === 'number' && item.badgeCount > 0 && !isCollapsed && (
                    <Badge variant="destructive" className="ml-auto">
                      {item.badgeCount}
                    </Badge>
                  )}
                  {typeof item.badgeCount === 'number' && item.badgeCount > 0 && isCollapsed && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                      {item.badgeCount > 99 ? '99+' : item.badgeCount}
                    </Badge>
                  )}
                </SidebarNavItem>
              );
            })}
          </SidebarNavGroup>
        ))}
      </ul>
      
      {/* Settings at bottom (Shopify pattern) */}
      <div className="mt-auto pt-4 border-t">
        <SidebarNavItem
          label={t('settings')}
          href={ROUTES.merchant.settings()}
          icon={Settings}
          isCollapsed={isCollapsed}
          isActive={pathname.startsWith(ROUTES.merchant.settings())}
        />
      </div>
    </nav>
  );
}
