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
  await clientApi.get<void>(API_ROUTES.csrfCookie(), { signal: options.signal });
}

/**
 * Login user with credentials.
 */
export async function login(
  credentials: LoginPayload,
  options: RequestOptions = {}
): Promise<ApiResponse<{ user: AuthTransportUser }>> {
  return loginWithRetry(credentials, options, false);
}

async function loginWithRetry(
  credentials: LoginPayload,
  options: RequestOptions,
  retried: boolean
): Promise<ApiResponse<{ user: AuthTransportUser }>> {
  try {
    await ensureCsrfCookie(options);
    return await clientApi.post(API_ROUTES.merchant.auth.login(), credentials, { signal: options.signal });
  } catch (error) {
    const apiError = error as ApiError;
    if (apiError.status === 419 && !retried) {
      await ensureCsrfCookie(options);
      return loginWithRetry(credentials, options, true);
    }

    throw error;
  }
}

/**
 * Register a new user.
 */
export async function register(
  payload: RegisterPayload,
  options: RequestOptions = {}
): Promise<ApiResponse<AuthTransportUser>> {
  await ensureCsrfCookie(options);
  return clientApi.post(API_ROUTES.merchant.auth.register(), payload, { signal: options.signal });
}

/**
 * Logout current user.
 */
export async function logout(options: RequestOptions = {}): Promise<ApiResponse<null>> {
  await ensureCsrfCookie(options);
  return clientApi.post(API_ROUTES.merchant.auth.logout(), undefined, { signal: options.signal });
}

/**
 * Get current authenticated user (Bootstrap).
 */
export async function bootstrap(options: RequestOptions = {}): Promise<ApiResponse<BootstrapData>> {
  return clientApi.get(API_ROUTES.merchant.auth.me(), { signal: options.signal });
}

/**
 * Forgot password request.
 */
export async function forgotPassword(payload: ForgotPasswordPayload): Promise<ApiResponse<void>> {
  return clientApi.post(API_ROUTES.merchant.auth.forgotPassword(), payload);
}

/**
 * Reset password request.
 */
export async function resetPassword(payload: ResetPasswordPayload): Promise<ApiResponse<void>> {
  return clientApi.post(API_ROUTES.merchant.auth.resetPassword(), payload);
}

/**
 * Check if the current user's email is verified.
 * Returns a 422 ApiError when not verified yet.
 */
export async function checkEmailVerificationStatus(
  options: RequestOptions = {}
): Promise<ApiResponse<{ email_verified: boolean; email_verified_at: string | null }>> {
  return clientApi.get(API_ROUTES.merchant.auth.emailStatus(), { signal: options.signal });
}

/**
 * Resend verification email.
 */
export async function resendVerificationEmail(options: RequestOptions = {}): Promise<ApiResponse<void>> {
  await ensureCsrfCookie(options);
  return clientApi.post(API_ROUTES.merchant.auth.resendVerification(), undefined, { signal: options.signal });
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
  return clientApi.get(API_ROUTES.merchant.auth.verifyEmail(id, hash), { params: rest });
}

/**
 * Switch active store.
 * Accepts either numeric store ID or merchant-facing slug.
 */
export async function switchStore(
  storeIdentifier: string | number,
  options: RequestOptions = {}
): Promise<ApiResponse<SwitchStoreResponse>> {
  await ensureCsrfCookie(options);
  return clientApi.patch(
    API_ROUTES.merchant.auth.activeStore(),
    { store_id: storeIdentifier },
    { signal: options.signal }
  );
}

/**
 * Get active sessions.
 */
export async function getSessions(): Promise<ApiResponse<any[]>> {
  // sessions endpoint was removed in backend refactor, returning empty for now or we should remove this function
  return { data: [], success: true, message: 'Sessions list deprecated' };
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
