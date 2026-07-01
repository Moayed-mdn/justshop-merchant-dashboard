import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { APP_CONFIG } from '@/config/app';
import { logger } from '@/lib/logger';
import { TENANT_CONFIG } from '@/lib/tenant/resolver';

function resolveRequestLocale(cookieStore: Awaited<ReturnType<typeof cookies>>, request: Request): string {
  const localeFromCookie = cookieStore.get(APP_CONFIG.sessionCookieName)?.value;
  if (localeFromCookie && APP_CONFIG.supportedLocales.includes(localeFromCookie as (typeof APP_CONFIG.supportedLocales)[number])) {
    return localeFromCookie;
  }

  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) {
    return APP_CONFIG.defaultLocale;
  }

  const preferredLocale = acceptLanguage
    .split(',')
    .map((part) => part.trim().split(';')[0]?.toLowerCase().split('-')[0])
    .find((locale): locale is string =>
      Boolean(locale) && APP_CONFIG.supportedLocales.includes(locale as (typeof APP_CONFIG.supportedLocales)[number])
    );

  return preferredLocale ?? APP_CONFIG.defaultLocale;
}

function getEndpoint(request: Request): string | null {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  if (!endpoint || !endpoint.startsWith('/')) {
    return null;
  }
  return endpoint;
}

function isLocalDevHostname(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local')
  );
}

function isTenantBaseHostname(hostname: string): boolean {
  const baseDomain = TENANT_CONFIG.baseDomain.toLowerCase();
  return hostname === baseDomain || hostname.endsWith(`.${baseDomain}`);
}

function normalizeDevSetCookie(value: string, request: Request): string {
  if (process.env.NODE_ENV !== 'development') {
    return value;
  }

  const requestUrl = new URL(request.url);
  const hostname = requestUrl.hostname.toLowerCase();

  if (!isLocalDevHostname(hostname)) {
    return value;
  }

  let normalized = value.replace(/;\s*Domain=\.?localhost/gi, '');

  if (isTenantBaseHostname(hostname)) {
    normalized = normalized.replace(/;\s*Domain=[^;]+/gi, '');
    normalized = `${normalized}; Domain=${TENANT_CONFIG.baseDomain}`;
  }

  if (requestUrl.protocol === 'http:') {
    normalized = normalized.replace(/;\s*Secure/gi, '');
    normalized = normalized.replace(/;\s*SameSite=None/gi, '; SameSite=Lax');
  }

  return normalized;
}

async function handleProxy(request: Request): Promise<NextResponse> {
  const endpoint = getEndpoint(request);
  if (!endpoint) {
    return NextResponse.json(
      { status: false, message: 'Missing or invalid endpoint query parameter' },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const xsrfToken = cookieStore.get('XSRF-TOKEN')?.value;
  const requestLocale = resolveRequestLocale(cookieStore, request);
  logger.debug('Proxy request locale resolved', { requestLocale });
  const method = request.method.toUpperCase();
  
  // Detect content type and handle body accordingly
  const requestContentType = request.headers.get('content-type');
  const isFormData = requestContentType?.includes('multipart/form-data');
  
  let body: FormData | string | undefined;
  const requestUrl = new URL(request.url);
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'locale': requestLocale,
    Cookie: cookieHeader,
    ...(xsrfToken && method !== 'GET' ? { 'X-XSRF-TOKEN': decodeURIComponent(xsrfToken) } : {}),
  };

  // Forward origin and referer so backend can resolve the frontend URL
  const origin = request.headers.get('origin');
  if (origin) {
    headers['Origin'] = origin;
  }
  const referer = request.headers.get('referer');
  if (referer) {
    headers['Referer'] = referer;
  }

  // Forward explicit frontend URL header if set by the client
  const frontendUrl = request.headers.get('x-frontend-url');
  if (frontendUrl) {
    headers['X-Frontend-Url'] = frontendUrl;
  }

  if (method === 'GET' || method === 'DELETE') {
    body = undefined;
    headers['Content-Type'] = 'application/json';
  } else if (isFormData) {
    // For FormData, get it directly and don't set Content-Type (browser sets it with boundary)
    body = await request.formData();
    // Don't set Content-Type header - fetch will set it automatically with the correct boundary
  } else {
    // For JSON and other content types
    const rawBody = await request.text();
    body = rawBody && rawBody.length > 0 ? rawBody : undefined;
    headers['Content-Type'] = 'application/json';
  }

  const upstream = await fetch(`${APP_CONFIG.apiBaseUrl}${endpoint}`, {
    method,
    credentials: 'include',
    headers,
    body: body as BodyInit | undefined,
    cache: 'no-store',
  });

  const status = upstream.status;
  const contentType = upstream.headers.get('content-type');
  const bodyText = await upstream.text();
  const hasBody = ![204, 205, 304].includes(status) && bodyText.length > 0;

  const responseHeaders = new Headers();
  if (contentType && hasBody) {
    responseHeaders.set('Content-Type', contentType);
  }

  const response = new NextResponse(hasBody ? bodyText : null, {
    status,
    headers: responseHeaders,
  });

  const setCookies = (upstream.headers as Headers & { getSetCookie?: () => string[] }).getSetCookie?.() ?? [];
  setCookies.forEach((value) => response.headers.append('set-cookie', normalizeDevSetCookie(value, request)));

  return response;
}

export async function GET(request: Request): Promise<NextResponse> {
  return handleProxy(request);
}

export async function POST(request: Request): Promise<NextResponse> {
  return handleProxy(request);
}

export async function PUT(request: Request): Promise<NextResponse> {
  return handleProxy(request);
}

export async function PATCH(request: Request): Promise<NextResponse> {
  return handleProxy(request);
}

export async function DELETE(request: Request): Promise<NextResponse> {
  return handleProxy(request);
}
