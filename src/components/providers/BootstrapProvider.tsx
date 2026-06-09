'use client';

import { useBootstrap } from '@/hooks/auth/useBootstrap';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from '@/lib/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { getAuthChannelSource, getAuthChannelStorageKey, parseAuthChannelMessage } from '@/lib/auth/channel';
import { getLoginUrl, stripLocale } from '@/lib/auth/redirects';
import { resolveBootstrapAccessState } from '@/lib/auth/bootstrap-routing';
import { ROUTES } from '@/config/routes';
import { queryKeys } from '@/lib/queryKeys';
import { Button } from '@/components/ui/button';
import { clearDashboardClientStorage } from '@/lib/auth/storage';

interface BootstrapProviderProps {
  children: ReactNode;
}

export function BootstrapProvider({ children }: BootstrapProviderProps) {
  const queryClient = useQueryClient();
  const bootstrapQuery = useBootstrap();

  const bootstrap = useBootstrapStore((state) => state.bootstrap);
  const provisioning = useBootstrapStore((state) => state.provisioning);
  const isAuthenticated = useBootstrapStore((state) => state.isAuthenticated);
  const isBootstrapping = useBootstrapStore((state) => state.isBootstrapping);
  const bootstrapResolved = useBootstrapStore((state) => state.bootstrapResolved);
  const bootstrapError = useBootstrapStore((state) => state.bootstrapError);
  const clearSession = useBootstrapStore((state) => state.clearSession);
  const pathname = usePathname();
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(
    () => typeof navigator === 'undefined' || navigator.onLine
  );
  const strippedPath = useMemo(() => stripLocale(pathname || '/'), [pathname]);
  const localeMatch = pathname?.match(/^\/(en|ar)(?:\/|$)/);
  const locale = localeMatch?.[1] ?? 'en';
  const routeStoreId = strippedPath.startsWith('/stores/') ? strippedPath.split('/')[2] ?? null : null;
  const accessState = useMemo(
    () => resolveBootstrapAccessState(bootstrap, provisioning),
    [bootstrap, provisioning]
  );
  const lastBootstrapRefreshAtRef = useRef(0);
  const lastChannelEventAtRef = useRef(0);
  const expiredSessionRedirectRef = useRef(false);

  const requestBootstrapRefresh = useCallback(() => {
    const now = Date.now();
    if (now - lastBootstrapRefreshAtRef.current < 1000) {
      return;
    }

    lastBootstrapRefreshAtRef.current = now;
    void bootstrapQuery.refetch();
  }, [bootstrapQuery]);

  const isGuestRoute =
    strippedPath === ROUTES.auth.login() ||
    strippedPath === ROUTES.auth.signup() ||
    strippedPath.startsWith('/forgot-password') ||
    strippedPath.startsWith('/reset-password');

  // /setup is the canonical setup route; /onboarding and /create-store redirect to it
  const isSetupRoute =
    strippedPath === ROUTES.setup() ||
    strippedPath === ROUTES.onboarding.home() ||
    strippedPath === ROUTES.onboarding.createStore();

  const isOnboardingRoute = isSetupRoute;

  const isMerchantRoute = strippedPath.startsWith('/merchant');

  const isProtectedRoute =
    strippedPath === ROUTES.dashboard.home() ||
    strippedPath.startsWith('/stores/') ||
    isMerchantRoute;

  const redirectTarget = useMemo(() => {
    if (!bootstrapResolved) {
      return null;
    }

    if (!isAuthenticated) {
      if (!(isProtectedRoute || isOnboardingRoute)) {
        return null;
      }

      const loginUrl = new URL(getLoginUrl(locale, pathname), 'http://localhost');
      if (expiredSessionRedirectRef.current) {
        loginUrl.searchParams.set('expired', '1');
      }

      return `${loginUrl.pathname}${loginUrl.search}`;
    }

    if (isGuestRoute) {
      // Users in mid-onboarding states should be allowed to visit /login freely
      // (e.g. clicking "Back to login" from the verify-email screen).
      // Without this exception the loop is: /login → isGuestRoute + pending_verification
      // → redirect to /setup → user clicks back → /login again, forever.
      if (
        accessState.kind === 'pending_verification' ||
        accessState.kind === 'create_store' ||
        accessState.kind === 'provisioning'
      ) {
        return null;
      }
      return accessState.redirectPath;
    }

    if (isMerchantRoute) {
      if (strippedPath === '/merchant' || strippedPath === '/merchant/') {
        return accessState.kind === 'ready' ? ROUTES.merchant.dashboard() : accessState.redirectPath;
      }

      if (accessState.kind === 'ready') {
        return null; // permit access
      }

      if (
        accessState.kind === 'create_store' ||
        accessState.kind === 'pending_verification' ||
        accessState.kind === 'provisioning'
      ) {
        return ROUTES.setup();
      }

      if (accessState.kind === 'blocked') {
        return ROUTES.dashboard.home();
      }
    }

    if (isOnboardingRoute) {
      if (accessState.kind === 'pending_verification') {
        return null; // stay on /setup, VerifyEmailStep will render
      }

      if (accessState.kind === 'create_store') {
        return null; // stay on /setup, CreateStoreStep will render
      }

      if (accessState.kind === 'provisioning') {
        return null; // stay on /setup, ProvisioningStep will render
      }

      return accessState.redirectPath;
    }

    if (strippedPath === ROUTES.dashboard.home()) {
      return accessState.kind === 'blocked' || accessState.kind === 'no_store'
        ? null
        : accessState.redirectPath;
    }

    if (strippedPath.startsWith('/stores/')) {
      if (accessState.kind !== 'ready') {
        return accessState.redirectPath;
      }

      if (!routeStoreId || routeStoreId !== accessState.activeStoreId) {
        return accessState.redirectPath;
      }
    }

    return null;
  }, [
    accessState,
    bootstrapResolved,
    isAuthenticated,
    isGuestRoute,
    isOnboardingRoute,
    isProtectedRoute,
    locale,
    pathname,
    routeStoreId,
    strippedPath,
  ]);

  // Handle multi-tab sync
  useEffect(() => {
    const bootstrapStorageKey = getAuthChannelStorageKey();

    const handleMessage = (data: unknown) => {
      const message = parseAuthChannelMessage(data);
      if (!message) {
        return;
      }

      if (message.source && message.source === getAuthChannelSource()) {
        return;
      }

      if (message.occurredAt > 0 && message.occurredAt <= lastChannelEventAtRef.current) {
        return;
      }

      if (message.occurredAt > 0) {
        lastChannelEventAtRef.current = message.occurredAt;
      }

      if (message.type === 'logout') {
        clearDashboardClientStorage();
        clearSession();
        queryClient.clear();
        queryClient.setQueryData(queryKeys.merchant.me(), null);
        return;
      }

      requestBootstrapRefresh();
    };

    if (typeof BroadcastChannel === 'undefined') {
      const onStorage = (event: StorageEvent) => {
        if (event.key !== bootstrapStorageKey || !event.newValue) {
          return;
        }

        try {
          handleMessage(JSON.parse(event.newValue) as unknown);
        } catch {
          // Ignore malformed cross-tab payloads.
        }
      };

      window.addEventListener('storage', onStorage);
      return () => {
        window.removeEventListener('storage', onStorage);
      };
    }

    const channel = new BroadcastChannel('auth_session');

    channel.onmessage = (event) => {
      handleMessage(event.data);
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key !== bootstrapStorageKey || !event.newValue) {
        return;
      }

      try {
        handleMessage(JSON.parse(event.newValue) as unknown);
      } catch {
        // Ignore malformed cross-tab payloads.
      }
    };

    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
      channel.close();
    };
  }, [clearSession, queryClient, requestBootstrapRefresh]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const refreshBootstrap = () => {
      const shouldRefresh = isAuthenticated || isProtectedRoute || isOnboardingRoute || isMerchantRoute;
      if (!shouldRefresh) {
        return;
      }

      requestBootstrapRefresh();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshBootstrap();
      }
    };

    const onOnline = () => {
      setIsOnline(true);
      refreshBootstrap();
    };

    const onOffline = () => {
      setIsOnline(false);
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, [isAuthenticated, isOnboardingRoute, isProtectedRoute, requestBootstrapRefresh]);

  useEffect(() => {
    if (isAuthenticated) {
      expiredSessionRedirectRef.current = false;
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const onUnauthorized = () => {
      expiredSessionRedirectRef.current = true;
      clearDashboardClientStorage();
      clearSession();
      queryClient.clear();
      queryClient.setQueryData(queryKeys.merchant.me(), null);

      if (isProtectedRoute || isOnboardingRoute) {
        const loginPath = ROUTES.auth.login();
        const redirectParam = encodeURIComponent(pathname);
        router.push(`${loginPath}?redirect=${redirectParam}&expired=1`);
      }
    };

    window.addEventListener('auth:unauthorized', onUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', onUnauthorized);
    };
  }, [clearSession, isOnboardingRoute, isProtectedRoute, locale, pathname, router]);

  useEffect(() => {
    if (!redirectTarget) {
      return;
    }

    if (stripLocale(redirectTarget) === strippedPath) {
      return;
    }

    router.push(redirectTarget);
  }, [redirectTarget, router, strippedPath]);

  const isInitialBootstrapping = !bootstrapResolved && isBootstrapping;
  const isRefreshingWithoutData = !bootstrap && isBootstrapping;
  const shouldShowFullScreenLoader = isInitialBootstrapping || isRefreshingWithoutData || Boolean(redirectTarget);

  if (shouldShowFullScreenLoader) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">
            {redirectTarget ? 'Redirecting to the correct dashboard state...' : 'Loading dashboard session...'}
          </p>
        </div>
      </div>
    );
  }

  if (bootstrapError) {
    // Special handling for domain mismatch errors — must be checked FIRST
    // before route-specific error handling, since it applies regardless of route type.
    const isDomainMismatch = 
      bootstrapError.code === 'IDENTITY_DOMAIN_MISMATCH' || 
      bootstrapError.action === 'logout_required';

    console.log('[BootstrapProvider] Error detected:', {
      code: bootstrapError.code,
      action: bootstrapError.action,
      logoutUrl: bootstrapError.logoutUrl,
      isDomainMismatch,
    });

    if (isDomainMismatch && bootstrapError.logoutUrl) {
      return (
        <div className="flex h-screen w-screen flex-col items-center justify-center p-4 text-center">
          <h1 className="mb-2 text-2xl font-bold text-destructive">Wrong Account Type</h1>
          <p className="mb-6 max-w-md text-muted-foreground">
            {bootstrapError.message || 'You are logged in with the wrong account type for this page.'}
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => void bootstrapQuery.refetch()}
            >
              Retry
            </Button>
            <Button
              onClick={async () => {
                try {
                  // Call the logout URL provided by the API
                  await fetch(bootstrapError.logoutUrl!, { 
                    method: 'POST',
                    credentials: 'include'
                  });
                  // Clear local session
                  clearSession();
                  clearDashboardClientStorage();
                  // Redirect to login
                  window.location.href = getLoginUrl(locale, pathname);
                } catch (error) {
                  console.error('Logout failed:', error);
                  // Still try to clear and redirect
                  clearSession();
                  clearDashboardClientStorage();
                  window.location.href = getLoginUrl(locale, pathname);
                }
              }}
            >
              Log Out and Switch Account
            </Button>
          </div>
        </div>
      );
    }

    if (isProtectedRoute || isOnboardingRoute) {
      return (
        <div className="flex h-screen w-screen flex-col items-center justify-center p-4 text-center">
          <h1 className="mb-2 text-2xl font-bold text-destructive">Bootstrap Failed</h1>
          <p className="mb-4 text-muted-foreground">
            {!isOnline
              ? 'The app is offline. Reconnect to restore your dashboard session.'
              : bootstrapError.message || 'The app could not restore the dashboard session.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button onClick={() => void bootstrapQuery.refetch()}>
              Retry
            </Button>
            <Button variant="outline" onClick={() => router.push(ROUTES.auth.login())}>
              Go to login
            </Button>
          </div>
        </div>
      );
    }

    if (isGuestRoute) {
      return (
        <>
          <div className="fixed inset-x-4 top-4 z-50 flex justify-center">
            <div className="w-full max-w-xl rounded-lg border border-destructive/30 bg-background px-4 py-3 text-sm shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="text-foreground">
                  {!isOnline
                    ? 'You are offline. Sign-in and onboarding actions will resume once the connection returns.'
                    : bootstrapError.message || 'Session restoration failed. You can still continue with guest actions.'}
                </p>
                <Button variant="outline" size="sm" onClick={() => void bootstrapQuery.refetch()}>
                  Retry
                </Button>
              </div>
            </div>
          </div>
          {children}
        </>
      );
    }

    // Fallback error handling
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center p-4 text-center">
        <h1 className="mb-2 text-2xl font-bold text-destructive">Bootstrap Failed</h1>
        <p className="mb-4 text-muted-foreground">
          {bootstrapError.message || 'The app could not restore the dashboard session.'}
        </p>
        <Button onClick={() => void bootstrapQuery.refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
