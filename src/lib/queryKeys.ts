/**
 * Centralized TanStack Query key factory.
 * All query keys must be defined here — never inline.
 */

export const queryKeys = {
  // ── MERCHANT ──────────────────────────────────────────────────
  merchant: {
    me: () => ['merchant', 'me'] as const,
    stores: () => ['merchant', 'stores'] as const,
    store: (storeId: string) => ({
      all:    () => ['merchant', 'store', storeId] as const,
      detail: () => ['merchant', 'store', storeId, 'detail'] as const,
      provisioning: () => ['merchant', 'store', storeId, 'provisioning'] as const,
    }),
  },

  // ── CUSTOMER ──────────────────────────────────────────────────
  customer: {
    me: () => ['customer', 'me'] as const,
  },

  // ── PLATFORM ──────────────────────────────────────────────────
  platform: {
    dashboard: () => ['platform', 'dashboard'] as const,
  },

  // ── STOREFRONT ────────────────────────────────────────────────
  storefront: {
    store: (storeId: string) => ({
      products: () => ['storefront', 'store', storeId, 'products'] as const,
      cart:     () => ['storefront', 'store', storeId, 'cart'] as const,
    }),
  },

  // ── PRODUCTS ──────────────────────────────────────────────────
  products: (storeId: string) => ({
    all:    () => ['merchant', storeId, 'products'] as const,
    lists:  () => ['merchant', storeId, 'products', 'list'] as const,
    list:   (filters: Record<string, unknown>) =>
      ['merchant', storeId, 'products', 'list', filters] as const,
    detail: (productId: string) =>
      ['merchant', storeId, 'products', 'detail', productId] as const,
  }),

  // ── CATEGORIES ────────────────────────────────────────────────
  categories: (storeId: string) => ({
    all:    () => ['merchant', storeId, 'categories'] as const,
    lists:  () => ['merchant', storeId, 'categories', 'list'] as const,
    list:   (filters: Record<string, unknown> = {}) =>
      ['merchant', storeId, 'categories', 'list', filters] as const,
    detail: (categoryId: string) =>
      ['merchant', storeId, 'categories', 'detail', categoryId] as const,
  }),

  // ── BRANDS ────────────────────────────────────────────────────
  brands: (storeId: string) => ({
    all:    () => ['merchant', storeId, 'brands'] as const,
    lists:  () => ['merchant', storeId, 'brands', 'list'] as const,
    list:   (filters: Record<string, unknown> = {}) =>
      ['merchant', storeId, 'brands', 'list', filters] as const,
    detail: (brandId: string) =>
      ['merchant', storeId, 'brands', 'detail', brandId] as const,
  }),

  // ── TAGS ────────────────────────────────────────────────────
  tags: (storeId: string) => ({
    all:    () => ['merchant', storeId, 'tags'] as const,
    lists:  () => ['merchant', storeId, 'tags', 'list'] as const,
    list:   (filters: Record<string, unknown> = {}) =>
      ['merchant', storeId, 'tags', 'list', filters] as const,
    detail: (tagId: string) =>
      ['merchant', storeId, 'tags', 'detail', tagId] as const,
  }),

  // ── ORDERS ────────────────────────────────────────────────────
  orders: (storeId: string) => ({
    all:    () => ['merchant', storeId, 'orders'] as const,
    lists:  () => ['merchant', storeId, 'orders', 'list'] as const,
    list:   (filters: Record<string, unknown>) =>
      ['merchant', storeId, 'orders', 'list', filters] as const,
    detail: (orderId: string) =>
      ['merchant', storeId, 'orders', 'detail', orderId] as const,
  }),

  // ── USERS ─────────────────────────────────────────────────────
  users: (storeId: string) => ({
    all:    () => ['merchant', storeId, 'users'] as const,
    lists:  () => ['merchant', storeId, 'users', 'list'] as const,
    list:   (filters: Record<string, unknown>) =>
      ['merchant', storeId, 'users', 'list', filters] as const,
    detail: (userId: string) =>
      ['merchant', storeId, 'users', 'detail', userId] as const,
  }),

  // ── CMS PAGES ─────────────────────────────────────────────────
  cmsPages: (storeId: string) => ({
    all:    () => ['merchant', storeId, 'cms-pages'] as const,
    lists:  () => ['merchant', storeId, 'cms-pages', 'list'] as const,
    list:   (filters: Record<string, unknown> = {}) =>
      ['merchant', storeId, 'cms-pages', 'list', filters] as const,
    detail: (pageId: string) =>
      ['merchant', storeId, 'cms-pages', 'detail', pageId] as const,
  }),

  // ── CMS SECTION TYPES ─────────────────────────────────────────
  marketingSectionTypes: (storeId: string) => ({
    all: () => ['merchant', storeId, 'marketing-section-types'] as const,
  }),

  // ── DASHBOARD ─────────────────────────────────────────────────
  dashboard: (storeId: string) => ({
    stats:        () => ['merchant', storeId, 'dashboard', 'stats'] as const,
    recentOrders: () => ['merchant', storeId, 'dashboard', 'recent-orders'] as const,
    topProducts:  () => ['merchant', storeId, 'dashboard', 'top-products'] as const,
  }),
};

/** @deprecated Use queryKeys.merchant.me() */
export const authKeys = {
  me: queryKeys.merchant.me,
};
