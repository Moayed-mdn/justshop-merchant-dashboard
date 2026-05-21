import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { resolveTenant, TENANT_CONFIG } from '@/lib/tenant/resolver';

const intlMiddleware = createMiddleware(routing);

const SESSION_COOKIE_CANDIDATES = [
  process.env.SANCTUM_SESSION_COOKIE,
  'laravel_session',
  'ecommerce_session',
].filter(Boolean) as string[];

/**
 * SaaS Middleware Foundation.
 * 
 * Responsibilities:
 * 1. Locale handling (via next-intl)
 * 2. Application type resolution (Marketing vs Dashboard vs Storefront)
 * 3. Tenant resolution (Subdomain/Custom Domain)
 * 4. Authentication enforcement
 */
export default function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // 1. Skip static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 2. Resolve Tenant Context (Architectural abstraction)
  const tenantContext = resolveTenant(hostname);
  const { appType, tenantSlug } = tenantContext;

  // 3. Storefront Deprecation: Redirect storefront domains to marketing for now
  // This app will no longer handle storefront rendering long-term
  if (appType === 'storefront') {
    const marketingUrl = new URL(request.nextUrl.clone());
    marketingUrl.hostname = TENANT_CONFIG.baseDomain;
    return NextResponse.redirect(marketingUrl);
  }

  // 4. Handle Locale via next-intl
  const response = intlMiddleware(request);

  // 5. Inject Tenant Context into headers for Server Components & API
  if (tenantSlug) {
    response.headers.set('x-tenant-slug', tenantSlug);
  }

  // 5. Authentication & Authorization logic
  const hasSessionCookie = SESSION_COOKIE_CANDIDATES.some((cookieName) =>
    request.cookies.has(cookieName)
  );

  const locales = routing.locales;
  const segment = pathname.split('/')[1];
  const locale = locales.includes(segment as typeof locales[number]) ? segment : routing.defaultLocale;
  const strippedPath = locales.includes(segment as typeof locales[number]) 
    ? '/' + pathname.split('/').slice(2).join('/') 
    : pathname;

  // Dashboard Layer Protection
  // Note: For now we assume anything under /stores is dashboard.
  const isDashboardRoute = strippedPath.startsWith('/stores');

  if (isDashboardRoute && !hasSessionCookie) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = `/${locale}/login`;
    // Only set redirect if it's a safe internal path
    if (pathname && !pathname.includes(':')) {
      loginUrl.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
