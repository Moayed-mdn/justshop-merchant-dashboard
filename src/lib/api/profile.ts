/**
 * Profile API functions for client-side use.
 * Handles user profile management (name, email, avatar, password).
 */

import { clientApi } from '@/lib/api/client';
import type { ApiResponse } from '@/types/api';
import { ensureCsrfCookie } from '@/lib/api/auth';

export interface ProfileData {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  has_password: boolean;
  has_google_linked: boolean;
  email_verified_at: string | null;
  created_at: string;
}

export interface UpdateProfileInfoPayload {
  name: string;
  email: string;
  phone?: string | null;
}

export interface UpdatePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

interface RequestOptions {
  signal?: AbortSignal;
}

/**
 * Get current user profile.
 */
export async function getProfile(
  options: RequestOptions = {}
): Promise<ApiResponse<ProfileData>> {
  return clientApi.get('/api/v1/merchant/profile', { signal: options.signal });
}

/**
 * Update user profile information (name, email, phone).
 */
export async function updateProfileInfo(
  payload: UpdateProfileInfoPayload,
  options: RequestOptions = {}
): Promise<ApiResponse<ProfileData>> {
  await ensureCsrfCookie(options);
  return clientApi.put('/api/v1/merchant/profile/info', payload, { signal: options.signal });
}

/**
 * Update user password.
 */
export async function updatePassword(
  payload: UpdatePasswordPayload,
  options: RequestOptions = {}
): Promise<ApiResponse<null>> {
  await ensureCsrfCookie(options);
  return clientApi.put('/api/v1/merchant/profile/password', payload, { signal: options.signal });
}

/**
 * Update user avatar.
 */
export async function updateAvatar(
  file: File,
  options: RequestOptions = {}
): Promise<ApiResponse<{ avatar: string }>> {
  await ensureCsrfCookie(options);
  
  const formData = new FormData();
  formData.append('avatar', file);

  // Use fetch directly for FormData upload
  const baseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  const response = await fetch(
    `${baseUrl}/api/proxy?endpoint=${encodeURIComponent('/api/v1/merchant/profile/avatar')}`,
    {
      method: 'POST',
      credentials: 'include',
      body: formData,
      signal: options.signal,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json();
}

/**
 * Delete user account.
 */
export async function deleteAccount(
  password: string,
  options: RequestOptions = {}
): Promise<ApiResponse<null>> {
  await ensureCsrfCookie(options);
  return clientApi.delete('/api/v1/merchant/profile', { password }, {
    ...options,
    // Send password in body for DELETE request
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
