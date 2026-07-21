'use server';

import { redirect } from 'next/navigation';
import type { User } from '@/types/auth';
import { API_ROUTES } from '@/config/routes';
import { serverFetch } from '@/lib/api/server';
import type { ApiError } from '@/types/api';

interface ApiSuccessResponse<T> {
  status: true;
  message: string;
  data: T;
}

interface LoginResponse {
  user: User;
}

/**
 * Login user with credentials.
 */
export async function login(formData: FormData): Promise<{ success: true; user: User } | { success: false; error: string; errors?: Record<string, string[]> }> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Email and password are required' };
  }

  try {
    await serverFetch<void>(API_ROUTES.csrfCookie(), {
      method: 'GET',
    });

    const response = await serverFetch<ApiSuccessResponse<LoginResponse>>(API_ROUTES.merchant.auth.login(), {
      method: 'POST',
      body: { email, password },
    });

    const { user } = response.data;
    return { success: true, user };
  } catch (error) {
    const apiError = error as ApiError;
    return {
      success: false,
      error: apiError.message ?? 'An unexpected error occurred',
      errors: apiError.errors,
    };
  }
}

/**
 * Logout user.
 */
export async function logout(locale: string = 'en'): Promise<void> {
  await serverFetch<void>(API_ROUTES.merchant.auth.logout(), {
    method: 'POST',
  }).catch(() => null);
  redirect(`/${locale}/login`);
}

/**
 * Get current authenticated user.
 */
export async function getMe(): Promise<User | null> {
  try {
    const response = await serverFetch<ApiSuccessResponse<User>>(API_ROUTES.merchant.auth.me(), {
      method: 'GET',
      cache: 'no-store',
    });

    console.log('[getMe] Success:', { userId: response.data.id, email: response.data.email });
    return response.data;
  } catch (error) {
    console.log('[getMe] Failed:', error);
    return null;
  }
}

/**
 * Check if user is authenticated.
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getMe();
  return user !== null;
}