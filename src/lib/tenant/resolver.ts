import { AppType, TenantContext } from './types';

/**
 * Configuration for tenant resolution.
 * In a real SaaS, these would come from environment variables.
 */
export const TENANT_CONFIG = {
  baseDomain: process.env.NEXT_PUBLIC_BASE_DOMAIN || 'laratenant.local',
  dashboardSubdomain: 'app',
  marketingSubdomain: 'www', // Optional: www.laratenant.local
};

/**
 * Resolves the application type and tenant context from a hostname.
 * 
 * Logic:
 * - laratenant.local or www.laratenant.local -> marketing
 * - app.laratenant.local -> dashboard
 * - {slug}.laratenant.local -> storefront
 * - anyotherdomain.com -> storefront (custom domain)
 */
export function resolveTenant(hostname: string): TenantContext {
  const cleanHostname = hostname.split(':')[0]; // Remove port if present

  // 1. Handle development/localhost
  if (
    cleanHostname === 'localhost' || 
    cleanHostname.includes('127.0.0.1') || 
    cleanHostname.endsWith('.localhost')
  ) {
    // For local dev, we default to marketing unless specified
    // In the future, we could use port mapping or specific localhost subdomains
    return {
      appType: 'marketing',
      tenantSlug: null,
      isCustomDomain: false,
    };
  }

  const { baseDomain, dashboardSubdomain, marketingSubdomain } = TENANT_CONFIG;

  // 2. Marketing App
  if (cleanHostname === baseDomain || cleanHostname === `${marketingSubdomain}.${baseDomain}`) {
    return {
      appType: 'marketing',
      tenantSlug: null,
      isCustomDomain: false,
    };
  }

  // 3. Dashboard App
  if (cleanHostname === `${dashboardSubdomain}.${baseDomain}`) {
    return {
      appType: 'dashboard',
      tenantSlug: null,
      isCustomDomain: false,
    };
  }

  // 4. Storefront App (Subdomain)
  if (cleanHostname.endsWith(`.${baseDomain}`)) {
    const tenantSlug = cleanHostname.replace(`.${baseDomain}`, '');
    return {
      appType: 'storefront',
      tenantSlug,
      isCustomDomain: false,
    };
  }

  // 5. Storefront App (Custom Domain)
  return {
    appType: 'storefront',
    tenantSlug: cleanHostname, // Hostname is the unique identifier for custom domains
    isCustomDomain: true,
  };
}

/**
 * Helper to check if a request is for a specific application type.
 */
export function isAppType(hostname: string, type: AppType): boolean {
  const context = resolveTenant(hostname);
  return context.appType === type;
}
