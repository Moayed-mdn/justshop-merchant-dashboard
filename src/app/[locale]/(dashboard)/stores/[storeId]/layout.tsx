/**
 * Dashboard layout for store-specific pages.
 * 
 * Server component that:
 * - Fetches current user using Bearer token from HttpOnly cookie (RSC pattern)
 * - Redirects to /login if unauthenticated (401)
 * - Wraps with AuthProvider for client-side auth state
 * - Renders DashboardShell with AuthInitializer to sync user to client store
 * 
 * Route group: (dashboard)
 * Paths: /en/stores/[storeId]/*, /ar/stores/[storeId]/*
 */

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getMe } from '@/lib/actions/auth.actions';
import { DashboardShell } from '@/features/dashboard/shell/DashboardShell';
import { AuthInitializer } from '@/features/dashboard/shell/AuthInitializer';
import { TenantInitializer } from '@/features/dashboard/shell/TenantInitializer';
import { AuthProvider } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';
import { getLoginUrl, getPostLoginRedirect } from '@/lib/auth/redirects';

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string; storeId: string }>;
}

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const { locale, storeId } = await params;
  const headerList = await headers();
  const tenantSlug = headerList.get('x-tenant-slug');

  // Get current user using Bearer token from cookie
  const user = await getMe();

  if (!user) {
    logger.warn('Dashboard layout: unauthenticated, redirecting to login');
    redirect(getLoginUrl(locale, `/stores/${storeId}`));
  }

  // Multi-tenant Security: Verify user has access to this store
  const userHasAccess = user.stores?.some(s => String(s.id) === storeId);
  
  if (!userHasAccess) {
    logger.error(`[Security] Unauthorized store access attempt by user ${user.id} to store ${storeId}`);
    // Redirect intelligently based on user state
    redirect(getPostLoginRedirect(user, locale));
  }

  // Map User (auth type) to AdminUser (admin store type)
  // User has stores[] — AdminUser expects store_id and role for the CURRENT store
  const currentStore = user.stores?.find(s => String(s.id) === storeId);
  
  const adminUser: import('@/types/user').AdminUser | null = user
    ? {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        email_verified_at: user.email_verified_at,
        has_password: user.has_password,
        has_google_linked: user.has_google_linked,
        store_id: currentStore?.id ?? null,
        role: currentStore?.role as import('@/types/user').UserRole | undefined,
        created_at: user.created_at,
        updated_at: user.updated_at,
      }
    : null;

  return (
    <AuthProvider initialUser={user}>
      <AuthInitializer user={adminUser}>
        <TenantInitializer tenantSlug={tenantSlug} />
        <DashboardShell>{children}</DashboardShell>
      </AuthInitializer>
    </AuthProvider>
  );
}
