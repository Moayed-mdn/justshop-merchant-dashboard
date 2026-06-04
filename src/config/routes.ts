/**
 * Route configuration.
 *
 * IMPORTANT RULE: ROUTES never include locale prefix.
 * next-intl router adds locale automatically.
 * These are used with next-intl's useRouter() and Link components.
 *
 * For hard redirects (redirect() from next/navigation in server components),
 * you must prepend the locale manually.
 */

export const ROUTES = {
  marketing: {
    home: () => '/' as const,
    pricing: () => '/pricing' as const,
    features: () => '/features' as const,
  },
  dashboard: {
    home: () => '/dashboard' as const,
  },
  auth: {
    login:  () => '/login' as const,
    logout: () => '/logout' as const,
    signup: () => '/signup' as const,
  },
  /**
   * Canonical merchant setup route.
   * All onboarding steps are rendered inside /setup as an internal state machine.
   */
  setup: () => '/setup' as const,
  /**
   * Legacy aliases — kept for redirect compatibility only.
   * Do not use these for new navigation. Use ROUTES.setup() instead.
   */
  onboarding: {
    home: () => '/onboarding' as const,
    createStore: () => '/create-store' as const,
  },
  stores: {
    new: () => '/setup' as const,
  },
  merchant: {
    dashboard:  () => '/merchant/dashboard' as const,
    orders:     () => '/merchant/orders' as const,
    products: {
      list: () => '/merchant/products' as const,
      new:  () => '/merchant/products/new' as const,
    },
    categories: {
      list: () => '/merchant/categories' as const,
      new:  () => '/merchant/categories/new' as const,
    },
    brands:     () => '/merchant/brands' as const,
    tags:       () => '/merchant/tags' as const,
    customers:  () => '/merchant/customers' as const,
    cmsPages:   () => '/merchant/cms/pages' as const,
    stores: {
      list:     () => '/merchant/stores' as const,
      create:   () => '/merchant/stores/create' as const,
      settings: (storeId: string) => `/merchant/stores/${storeId}/settings` as const,
    },
    settings:   () => '/merchant/settings' as const,
  },
  store: (storeId: string) => ({
    dashboard: () => `/stores/${storeId}/dashboard` as const,

    users: {
      list:   () => `/stores/${storeId}/users` as const,
      detail: (userId: string) =>
        `/stores/${storeId}/users/${userId}` as const,
    },

    products: {
      list:   () => `/stores/${storeId}/products` as const,
      new:    () => `/stores/${storeId}/products/new` as const,
      edit:   (productId: string) =>
        `/stores/${storeId}/products/${productId}` as const,
    },

    orders: {
      list:   () => `/stores/${storeId}/orders` as const,
      detail: (orderId: string) =>
        `/stores/${storeId}/orders/${orderId}` as const,
    },

    categories: {
      list: () => `/stores/${storeId}/categories` as const,
      new:  () => `/stores/${storeId}/categories/new` as const,
      edit: (categoryId: string) =>
        `/stores/${storeId}/categories/${categoryId}/edit` as const,
    },

    brands: {
      list: () => `/stores/${storeId}/brands` as const,
      new:  () => `/stores/${storeId}/brands/new` as const,
      edit: (brandId: string) =>
        `/stores/${storeId}/brands/${brandId}/edit` as const,
    },

    tags: {
      list: () => `/stores/${storeId}/tags` as const,
      new:  () => `/stores/${storeId}/tags/new` as const,
      edit: (tagId: string) =>
        `/stores/${storeId}/tags/${tagId}/edit` as const,
    },
  }),
} as const;

export const API_ROUTES = {
  // ── AUTH & IDENTITY ──────────────────────────────────────────
  // Shared identity endpoints
  csrfCookie: () => '/api/sanctum/csrf-cookie',

  // ── MERCHANT CONTEXT ──────────────────────────────────────────
  merchant: {
    auth: {
      login:              () => '/api/v1/merchant/auth/login',
      logout:             () => '/api/v1/merchant/auth/logout',
      register:           () => '/api/v1/merchant/auth/register',
      me:                 () => '/api/v1/merchant/me',
      activeStore:        () => '/api/v1/merchant/auth/active-store',
      forgotPassword:     () => '/api/v1/merchant/auth/password/forgot',
      resetPassword:      () => '/api/v1/merchant/auth/password/reset',
      resendVerification: () => '/api/v1/merchant/auth/email/resend',
      emailStatus:        () => '/api/v1/merchant/auth/email/status',
      verifyEmail: (id: string, hash: string) =>
        `/api/v1/merchant/auth/email/verify/${id}/${hash}`,
    },
    stores: {
      list:               () => '/api/v1/merchant/stores',
      create:             () => '/api/v1/merchant/stores',
      detail: (storeId: string) => `/api/v1/merchant/stores/${storeId}`,
      update: (storeId: string) => `/api/v1/merchant/stores/${storeId}`,
      slugCheck: (slug: string) => `/api/v1/merchant/stores/slug-check?slug=${slug}`,
      provisioningStatus: (storeId: string) =>
        `/api/v1/merchant/stores/${storeId}/provisioning-status`,
    },
  },

  // ── CUSTOMER CONTEXT ──────────────────────────────────────────
  customer: {
    bootstrap:            () => '/api/v1/customer/bootstrap',
    me:                   () => '/api/v1/customer/me',
    auth: {
      login:              () => '/api/v1/customer/auth/login',
      logout:             () => '/api/v1/customer/auth/logout',
      register:           () => '/api/v1/customer/auth/register',
    },
  },

  // ── PLATFORM CONTEXT ──────────────────────────────────────────
  platform: {
    dashboard:            () => '/api/v1/platform/dashboard',
    analytics:            () => '/api/v1/platform/analytics',
    stores:               () => '/api/v1/platform/stores',
    users:                () => '/api/v1/platform/users',
    cmsPages: () => ({
      list:    () => '/api/v1/platform/cms/pages/platform',
      create:  () => '/api/v1/platform/cms/pages/platform',
      detail:  (pageId: string) => `/api/v1/platform/cms/pages/platform/${pageId}`,
      update:  (pageId: string) => `/api/v1/platform/cms/pages/platform/${pageId}`,
      delete:  (pageId: string) => `/api/v1/platform/cms/pages/platform/${pageId}`,
      publish: (pageId: string) => `/api/v1/platform/cms/pages/platform/${pageId}/publish`,
    }),
  },

  // ── STOREFRONT CONTEXT ────────────────────────────────────────
  storefront: {
    stores: (storeId: string) => ({
      products:           () => `/api/v1/storefront/stores/${storeId}/products`,
      cart:               () => `/api/v1/storefront/stores/${storeId}/cart`,
      checkout:           () => `/api/v1/storefront/stores/${storeId}/checkout`,
    }),
  },

  // ── PUBLIC CMS ───────────────────────────────────────────────
  public: {
    cms: {
      pages: (slug: string) => `/api/v1/public/cms/pages/${slug}`,
      blog:                 () => '/api/v1/public/cms/blog',
      blogPost: (slug: string) => `/api/v1/public/cms/blog/${slug}`,
      docs: (slugPath: string) => `/api/v1/public/cms/docs/${slugPath}`,
      docsSidebar:          () => '/api/v1/public/cms/docs/sidebar',
      sitemap: (domain: string) => `/api/v1/public/cms/seo/sitemap/${domain}`,
      robots:               () => '/api/v1/public/cms/seo/robots.txt',
    },
  },

  // ── MERCHANT OPERATIONAL (STORE-SCOPED) ───────────────────────
  // These are for the merchant dashboard operating WITHIN a store context
  store: (storeId: string) => ({
    dashboard: () => ({
      stats:        () => `/api/v1/merchant/stores/${storeId}/dashboard/stats`,
      recentOrders: () => `/api/v1/merchant/stores/${storeId}/dashboard/recent-orders`,
      topProducts:  () => `/api/v1/merchant/stores/${storeId}/dashboard/top-products`,
    }),
    products: () => ({
      list:    () => `/api/v1/merchant/stores/${storeId}/products`,
      detail:  (productId: string) =>
        `/api/v1/merchant/stores/${storeId}/products/${productId}`,
      restore: (productId: string) =>
        `/api/v1/merchant/stores/${storeId}/products/${productId}/restore`,
    }),
    orders: () => ({
      list:         () => `/api/v1/merchant/stores/${storeId}/orders`,
      detail:       (orderId: string) =>
        `/api/v1/merchant/stores/${storeId}/orders/${orderId}`,
      updateStatus: (orderId: string) =>
        `/api/v1/merchant/stores/${storeId}/orders/${orderId}/status`,
    }),
    categories: () => ({
      list:    () => `/api/v1/merchant/stores/${storeId}/categories`,
      detail:  (categoryId: string) =>
        `/api/v1/merchant/stores/${storeId}/categories/${categoryId}`,
      create:  () => `/api/v1/merchant/stores/${storeId}/categories`,
      update:  (categoryId: string) =>
        `/api/v1/merchant/stores/${storeId}/categories/${categoryId}`,
      delete:  (categoryId: string) =>
        `/api/v1/merchant/stores/${storeId}/categories/${categoryId}`,
      restore: (categoryId: string) =>
        `/api/v1/merchant/stores/${storeId}/categories/${categoryId}/restore`,
    }),
    brands: () => ({
      list:    () => `/api/v1/merchant/stores/${storeId}/brands`,
      detail:  (brandId: string) =>
        `/api/v1/merchant/stores/${storeId}/brands/${brandId}`,
      create:  () => `/api/v1/merchant/stores/${storeId}/brands`,
      update:  (brandId: string) =>
        `/api/v1/merchant/stores/${storeId}/brands/${brandId}`,
      delete:  (brandId: string) =>
        `/api/v1/merchant/stores/${storeId}/brands/${brandId}`,
      restore: (brandId: string) =>
        `/api/v1/merchant/stores/${storeId}/brands/${brandId}/restore`,
    }),
    tags: () => ({
      list:    () => `/api/v1/merchant/stores/${storeId}/tags`,
      detail:  (tagId: string) =>
        `/api/v1/merchant/stores/${storeId}/tags/${tagId}`,
      create:  () => `/api/v1/merchant/stores/${storeId}/tags`,
      update:  (tagId: string) =>
        `/api/v1/merchant/stores/${storeId}/tags/${tagId}`,
      delete:  (tagId: string) =>
        `/api/v1/merchant/stores/${storeId}/tags/${tagId}`,
    }),
    users: () => ({
      list:   () => `/api/v1/merchant/stores/${storeId}/users`,
      create: () => `/api/v1/merchant/stores/${storeId}/users`,
      detail: (userId: string) =>
        `/api/v1/merchant/stores/${storeId}/users/${userId}`,
    }),
    cmsPages: () => ({
      list:      () => `/api/v1/merchant/stores/${storeId}/cms/pages`,
      detail:    (pageId: string) =>
        `/api/v1/merchant/stores/${storeId}/cms/pages/${pageId}`,
      create:    () => `/api/v1/merchant/stores/${storeId}/cms/pages`,
      update:    (pageId: string) =>
        `/api/v1/merchant/stores/${storeId}/cms/pages/${pageId}`,
      delete:    (pageId: string) =>
        `/api/v1/merchant/stores/${storeId}/cms/pages/${pageId}`,
      publish:   (pageId: string) =>
        `/api/v1/merchant/stores/${storeId}/cms/pages/${pageId}/publish`,
      unpublish: (pageId: string) =>
        `/api/v1/merchant/stores/${storeId}/cms/pages/${pageId}/unpublish`,
    }),
    sectionTypes: () => `/api/v1/merchant/stores/${storeId}/cms/section-types`,
  }),
} as const;

/**
 * Context-aware route helper (PREPARATION for storeId removal from URL).
 * In the future, this will use the active store from context/session
 * instead of requiring an explicit storeId.
 * 
 * Usage in hooks/components:
 * const routes = useActiveStoreRoutes(currentStoreId);
 */
export const useActiveStoreRoutes = (storeId: string) => ROUTES.store(storeId);
