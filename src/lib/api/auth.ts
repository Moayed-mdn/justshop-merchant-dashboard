/**
 * Auth API functions for client-side use.
 * These are plain async functions — not hooks.
 */

import { clientApi } from '@/lib/api/client';
import type { ApiResponse } from '@/types/api';
import type {
  AuthTransportUser,
  LoginPayload,
  RegisterPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  BootstrapData,
  SwitchStoreResponse,
} from '@/types/auth';
import { API_ROUTES } from '@/config/routes';
import {
  buildHeaders,
  DEFAULT_JSON_HEADERS,
  parseResponseBody,
  toApiError,
} from '@/lib/api/core/transport';

interface RequestOptions {
  signal?: AbortSignal;
}

export async function ensureCsrfCookie(options: RequestOptions = {}): Promise<void> {
  await clientApi.get<void>(API_ROUTES.auth.csrfCookie(), { signal: options.signal });
}

/**
 * Login user with credentials.
 */
export async function login(
  credentials: LoginPayload,
  options: RequestOptions = {}
): Promise<ApiResponse<{ user: AuthTransportUser }>> {
  await ensureCsrfCookie(options);
  return clientApi.post(API_ROUTES.auth.login(), credentials, { signal: options.signal });
}

/**
 * Register a new user.
 */
export async function register(
  payload: RegisterPayload,
  options: RequestOptions = {}
): Promise<ApiResponse<AuthTransportUser>> {
  await ensureCsrfCookie(options);
  return clientApi.post(API_ROUTES.auth.register(), payload, { signal: options.signal });
}

/**
 * Logout current user.
 */
export async function logout(options: RequestOptions = {}): Promise<ApiResponse<null>> {
  await ensureCsrfCookie(options);
  return clientApi.post(API_ROUTES.auth.logout(), undefined, { signal: options.signal });
}

/**
 * Get current authenticated user (Bootstrap).
 */
export async function bootstrap(options: RequestOptions = {}): Promise<ApiResponse<BootstrapData>> {
  return clientApi.get(API_ROUTES.auth.me(), { signal: options.signal });
}

/**
 * Forgot password request.
 */
export async function forgotPassword(payload: ForgotPasswordPayload): Promise<ApiResponse<void>> {
  return clientApi.post(API_ROUTES.auth.forgotPassword(), payload);
}

/**
 * Reset password request.
 */
export async function resetPassword(payload: ResetPasswordPayload): Promise<ApiResponse<void>> {
  return clientApi.post(API_ROUTES.auth.resetPassword(), payload);
}

/**
 * Resend verification email.
 */
export async function resendVerificationEmail(options: RequestOptions = {}): Promise<ApiResponse<void>> {
  await ensureCsrfCookie(options);
  return clientApi.post(API_ROUTES.auth.resendVerification(), undefined, { signal: options.signal });
}

/**
 * Verify email.
 */
export async function verifyEmail(params: {
  id: string;
  hash: string;
  expires: string;
  signature: string;
}): Promise<ApiResponse<void>> {
  const { id, hash, ...rest } = params;
  return clientApi.get(API_ROUTES.auth.verifyEmail(id, hash), { params: rest });
}

/**
 * Switch active store.
 */
export async function switchStore(
  storeId: string | number,
  options: RequestOptions = {}
): Promise<ApiResponse<SwitchStoreResponse>> {
  await ensureCsrfCookie(options);
  const normalizedStoreId =
    typeof storeId === 'string' && /^\d+$/.test(storeId) ? Number(storeId) : storeId;
  return clientApi.patch(
    API_ROUTES.auth.switchStore(),
    { store_id: normalizedStoreId },
    { signal: options.signal }
  );
}

/**
 * Get active sessions.
 */
export async function getSessions(): Promise<ApiResponse<any[]>> {
  return clientApi.get(API_ROUTES.auth.sessions());
}

interface SessionMeResponse {
  status: boolean;
  user?: BootstrapData['user'];
  message?: string;
}

/**
 * Get current session user through internal Next auth route.
 * Used by AuthContext to keep browser auth hydration centralized.
 */
export async function getSessionMe(): Promise<BootstrapData['user'] | null> {
  const response = await fetch('/api/auth/me', {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
    headers: buildHeaders(DEFAULT_JSON_HEADERS),
  });

  if (!response.ok) {
    if (response.status === 401) {
      return null;
    }
    throw await toApiError(response, 'Failed to fetch current user');
  }

  const data = await parseResponseBody<SessionMeResponse>(response);
  return data?.user ?? null;
}

/**
 * Logout current session through internal Next auth route.
 */
export async function logoutSession(): Promise<void> {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
    headers: buildHeaders(DEFAULT_JSON_HEADERS),
  });

  if (!response.ok) {
    throw await toApiError(response, 'Logout failed');
  }
}
