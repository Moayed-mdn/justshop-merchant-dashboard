import { ROUTES } from '@/config/routes';

/**
 * Validates if a redirect path is internal and safe to redirect to.
 * Prevents open redirect vulnerabilities.
 */
export function isSafeRedirectPath(path: string | null | undefined): boolean {
  if (!path) return false;
  
  // Must start with / and not be a protocol-relative URL (//)
  // Also block potential javascript: or data: schemes
  return path.startsWith('/') && !path.startsWith('//') && !path.includes(':');
}

/**
 * Strips any supported locale prefix from a path.
 * e.g., /en/stores/1 -> /stores/1
 */
export function stripLocale(path: string): string {
  if (!path.startsWith('/')) return path;
  
  const segments = path.split('/');
  // Supported locales: en, ar
  const locales = ['en', 'ar'];
  
  if (segments.length > 1 && locales.includes(segments[1])) {
    return '/' + segments.slice(2).join('/');
  }
  
  return path;
}

/**
 * Build a locale-aware login URL with an optional redirect parameter.
 */
export function getLoginUrl(locale: string, redirectPath?: string): string {
  const loginPath = `/${locale}${ROUTES.auth.login()}`;
  
  if (redirectPath && isSafeRedirectPath(redirectPath)) {
    // Ensure the redirect path has the locale prefix. 
    // If it already has a locale, we preserve it.
    const hasLocale = /^\/(en|ar)(\/|$)/.test(redirectPath);
    const safePath = hasLocale ? redirectPath : `/${locale}${redirectPath.startsWith('/') ? '' : '/'}${redirectPath}`;
    
    return `${loginPath}?redirect=${encodeURIComponent(safePath)}`;
  }
  
  return loginPath;
}

/**
 * Determine the correct post-login destination based on user state.
 */
export function getPostLoginRedirect(
  user: { stores?: Array<{ id: number | string }> } | null,
  locale: string
): string {
  const firstStoreId = user?.stores?.[0]?.id;
  
  if (firstStoreId) {
    return `/${locale}${ROUTES.store(String(firstStoreId)).dashboard()}`;
  }
  
  // Fallback to onboarding if no stores exist
  return `/${locale}${ROUTES.onboarding.home()}`;
}

/**
 * Build a locale-aware logout URL.
 */
export function getLogoutUrl(locale: string): string {
  return `/${locale}${ROUTES.auth.login()}`;
}
