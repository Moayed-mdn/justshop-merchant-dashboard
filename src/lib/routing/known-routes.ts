/**
 * Known non-storefront paths for middleware 404 guards.
 *
 * Storefront catch-all `[...slug]` matches any unknown path. On marketing/dashboard
 * hosts we block unmatched paths before they hit that route.
 */

const EXACT_SEGMENTS = new Set([
  '',
  'pricing',
  'features',
  'enterprise',
  'about',
  'contact',
  'templates',
  'demo',
  'docs',
  'blog',
  'dashboard',
  'login',
  'logout',
  'signup',
  'setup',
  'forgot-password',
  'reset-password',
  'verify-email',
  'email-verification-success',
  '__not-found',
]);

const PREFIXES = ['docs/', 'blog/', 'merchant/', 'account/', 'verify-email/'];

function normalizePath(path: string): string {
  return path.replace(/^\/+|\/+$/g, '');
}

export function isKnownNonStorefrontPath(path: string): boolean {
  const normalized = normalizePath(path);
  if (EXACT_SEGMENTS.has(normalized)) {
    return true;
  }
  return PREFIXES.some((prefix) => normalized.startsWith(prefix));
}
