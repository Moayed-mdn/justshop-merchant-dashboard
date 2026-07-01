import type { Store } from '@/types/store';

type StoreRouteSource = Pick<Store, 'slug'> | null | undefined;

/**
 * Merchant-facing store routes use slug only.
 */
export function getStoreRouteParam(store: StoreRouteSource): string {
  if (!store) {
    return '';
  }

  return store.slug;
}

/**
 * Match store identifiers by slug only.
 */
export function matchesStoreIdentifier(
  store: StoreRouteSource,
  identifier: string | null | undefined
): boolean {
  if (!store || !identifier) {
    return false;
  }

  return store.slug === identifier;
}
