/**
 * Navigation Resources Hooks
 * 
 * Hooks for fetching available resources (pages, categories, products)
 * to link in navigation menu items.
 */

import { useQuery } from '@tanstack/react-query';
import {
  getNavigationResourcePages,
  getNavigationResourceCategories,
  getNavigationResourceProducts,
  validateNavigationUrl,
} from '@/lib/api/navigation';

// ── Types ─────────────────────────────────────────────────────────────────

export interface NavigationResourcePage {
  id: number;
  title: {
    en: string;
    ar: string;
  };
  slug: {
    en: string;
    ar: string;
  };
  url: string;
  status: string;
  publishedAt: string | null;
}

export interface NavigationResourceCategory {
  id: number;
  name: {
    en: string;
    ar: string;
  };
  slug: string;
  url: string;
  parentId: number | null;
}

export interface NavigationResourceProduct {
  id: number;
  name: {
    en: string;
    ar: string;
  };
  slug: string;
  url: string;
  categoryId: number | null;
}

// ── Hooks ─────────────────────────────────────────────────────────────────

/**
 * Fetch all available pages for the store
 */
export function useNavigationPages(storeId: string, search?: string) {
  return useQuery({
    queryKey: ['navigation-resources', 'pages', storeId, search],
    queryFn: () => getNavigationResourcePages(storeId, search),
    enabled: !!storeId,
  });
}

/**
 * Fetch all available categories for the store
 */
export function useNavigationCategories(storeId: string, search?: string) {
  return useQuery({
    queryKey: ['navigation-resources', 'categories', storeId, search],
    queryFn: () => getNavigationResourceCategories(storeId, search),
    enabled: !!storeId,
  });
}

/**
 * Fetch all available products for the store
 */
export function useNavigationProducts(storeId: string, search?: string) {
  return useQuery({
    queryKey: ['navigation-resources', 'products', storeId, search],
    queryFn: () => getNavigationResourceProducts(storeId, search),
    enabled: !!storeId,
  });
}

/**
 * Validate if a URL exists (debounced for real-time validation)
 */
export function useValidateNavigationUrl(storeId: string, url: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['navigation-validate-url', storeId, url],
    queryFn: () => validateNavigationUrl(storeId, url),
    enabled: enabled && !!storeId && !!url && url.length > 1,
    staleTime: 30000, // Cache for 30 seconds
  });
}

