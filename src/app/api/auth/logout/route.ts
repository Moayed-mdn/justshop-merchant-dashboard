/**
 * POST /api/auth/logout
 * 
 * Route handler for client-side logout.
 * Revokes token on backend and clears the auth cookie.
 */

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { API_ROUTES } from '@/config/routes';
import { serverFetch } from '@/lib/api/server';
import type { ApiError } from '@/types/api';

/**
 * POST handler for /api/auth/logout
 */
export async function POST(): Promise<NextResponse> {
  try {
    // 1. Notify backend to revoke session
    try {
      await serverFetch<void>(API_ROUTES.merchant.auth.logout(), {
        method: 'POST',
      });
    } catch (e) {
      // Even if backend fails, we want to clear local session
      console.error('Backend logout failed', e);
    }

    // 2. Clear local cookies
    const cookieStore = await cookies();
    
    // List of common cookies to clear
    const sanctumCookie = process.env.SANCTUM_SESSION_COOKIE;
    const cookiesToClear = [
      sanctumCookie,
      'laravel_session',
      'ecommerce_session',
      'XSRF-TOKEN',
      'auth_token',
    ].filter(Boolean) as string[];
    
    const response = NextResponse.json({ success: true, message: 'Logged out' });

    cookiesToClear.forEach(cookieName => {
      response.cookies.set(cookieName, '', {
        maxAge: 0,
        path: '/',
      });
    });

    return response;
  } catch (error) {
    const apiError = error as ApiError;
    return NextResponse.json(
      { success: false, message: apiError.message ?? 'Logout failed' },
      { status: apiError.status || 500 }
    );
  }
}
