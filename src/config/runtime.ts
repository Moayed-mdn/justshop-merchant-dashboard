/**
 * Storefront runtime API contract configuration.
 */

export const RUNTIME_CONFIG = {
  /**
   * Contract version sent as X-Storefront-Version on runtime API requests.
   * Must match a version supported by the backend runtime controller.
   */
  version: process.env.NEXT_PUBLIC_STOREFRONT_RUNTIME_VERSION ?? '2026-06-26',
  versionHeader: 'X-Storefront-Version',
} as const;
