import { clientApi } from './client';
import type {
  RuntimeResponse,
  RouteResolution,
  RuntimePageData,
  NavigationPayload,
  RuntimeThemePayload,
} from '@/types/runtime';

const RUNTIME_API = '/api/v1/storefront/runtime';

export interface ResolveRouteParams {
  path: string;
  locale: string;
  preview?: boolean;
}

export interface GetPageParams {
  preview?: boolean;
}

export async function resolveRoute(
  params: ResolveRouteParams
): Promise<RuntimeResponse<RouteResolution>> {
  return clientApi.get<RuntimeResponse<RouteResolution>>(
    `${RUNTIME_API}/resolve`,
    { params: { path: params.path, locale: params.locale, ...(params.preview ? { preview: '1' } : {}) } }
  );
}

export async function getPage(
  pageId: string,
  params?: GetPageParams
): Promise<RuntimeResponse<RuntimePageData>> {
  return clientApi.get<RuntimeResponse<RuntimePageData>>(
    `${RUNTIME_API}/page/${pageId}`,
    { params: { ...(params?.preview ? { preview: '1' } : {}) } }
  );
}

export async function getNavigation(): Promise<RuntimeResponse<NavigationPayload>> {
  return clientApi.get<RuntimeResponse<NavigationPayload>>(
    `${RUNTIME_API}/navigation`
  );
}

export async function getTheme(): Promise<RuntimeResponse<RuntimeThemePayload>> {
  return clientApi.get<RuntimeResponse<RuntimeThemePayload>>(
    `${RUNTIME_API}/theme`
  );
}
