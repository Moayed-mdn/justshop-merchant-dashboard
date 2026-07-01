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
export function useNavigationPages(storeSlug: string, search?: string) {
  return useQuery({
    queryKey: ['navigation-resources', 'pages', storeSlug, search],
    queryFn: () => getNavigationResourcePages(storeSlug, search),
    enabled: !!storeSlug,
  });
}

/**
 * Fetch all available categories for the store
 */
export function useNavigationCategories(storeSlug: string, search?: string) {
  return useQuery({
    queryKey: ['navigation-resources', 'categories', storeSlug, search],
    queryFn: () => getNavigationResourceCategories(storeSlug, search),
    enabled: !!storeSlug,
  });
}

/**
 * Fetch all available products for the store
 */
export function useNavigationProducts(storeSlug: string, search?: string) {
  return useQuery({
    queryKey: ['navigation-resources', 'products', storeSlug, search],
    queryFn: () => getNavigationResourceProducts(storeSlug, search),
    enabled: !!storeSlug,
  });
}

/**
 * Validate if a URL exists (debounced for real-time validation)
 */
export function useValidateNavigationUrl(storeSlug: string, url: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['navigation-validate-url', storeSlug, url],
    queryFn: () => validateNavigationUrl(storeSlug, url),
    enabled: enabled && !!storeSlug && !!url && url.length > 1,
    staleTime: 30000, // Cache for 30 seconds
  });
}

