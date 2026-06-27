'use client';

/**
 * Breadcrumbs component.
 * Shows current page hierarchy for better navigation freedom.
 * 
 * Part of Heuristic 3: User Control and Freedom
 * - Users always know where they are and can go back
 */

import React from 'react';
import { usePathname } from '@/lib/navigation';
import { ROUTES } from '@/config/routes';
import { useTranslations } from 'next-intl';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrent: boolean;
}

/**
 * Generates breadcrumb items based on current path
 */
function useBreadcrumbItems(): BreadcrumbItem[] {
  const pathname = usePathname();
  const t = useTranslations('nav');
  
  // Extract locale from path (first segment)
  const segments = pathname.split('/').filter(Boolean);
  const items: BreadcrumbItem[] = [];
  
  // First segment is locale, skip it for actual navigation
  const navSegments = segments.slice(1);
  
  // Add dashboard/home
  items.push({
    label: t('dashboard'),
    href: ROUTES.merchant.dashboard(),
    isCurrent: navSegments.length === 0,
  });
  
  // Build breadcrumbs based on path segments
  let currentPath = '';
  const segmentMap: Record<string, string> = {
    'dashboard': t('dashboard'),
    'orders': t('orders'),
    'products': t('products'),
    'categories': t('categories'),
    'brands': t('brands'),
    'tags': t('tags'),
    'customers': t('customers'),
    'cms-pages': t('marketingPages'),
    'navigation': t('navigation'),
    'themes': t('themes'),
    'settings': t('settings'),
    'billing': t('billing'),
  };
  
  navSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === navSegments.length - 1;
    
    // Handle dynamic segments like [storeId] or [productId], etc.
    let label = segmentMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    
    // For dynamic IDs, we could fetch or use placeholder
    if (segment.startsWith('[') || segment.endsWith(']')) {
      label = 'Details';
    }
    
    let href;
    switch (segment) {
      case 'orders':
        href = ROUTES.merchant.orders.list();
        break;
      case 'products':
        href = ROUTES.merchant.products.list();
        break;
      case 'categories':
        href = ROUTES.merchant.categories.list();
        break;
      case 'brands':
        href = ROUTES.merchant.brands.list();
        break;
      case 'tags':
        href = ROUTES.merchant.tags.list();
        break;
      case 'customers':
        href = ROUTES.merchant.customers.list();
        break;
      case 'settings':
        href = ROUTES.merchant.settings();
        break;
      default:
        href = `/${segments[0]}/merchant${currentPath}`;
    }
    
    items.push({
      label,
      href,
      isCurrent: isLast,
    });
  });
  
  return items;
}

/**
 * Breadcrumbs component.
 * Shows navigation path with clickable links.
 */
export function Breadcrumbs() {
  const items = useBreadcrumbItems();
  
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={item.href}>
            <BreadcrumbItem>
              {item.isCurrent ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export { useBreadcrumbItems };
