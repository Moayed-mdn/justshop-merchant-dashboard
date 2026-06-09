'use client';

import { useEffect, useRef } from 'react';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { useSwitchStore } from '@/hooks/auth/useSwitchStore';
import { useRouter } from '@/lib/navigation';
import { Loader2 } from 'lucide-react';
import { logger } from '@/lib/logger';
import { logUXEvent } from '@/lib/ux-events';

interface LegacyRouteRedirectorProps {
  storeId: string;
  targetPath: string;
  originalRoute: string;
}

/**
 * Compatibility adapter for legacy store-scoped routes.
 *
 * Hydrates the active store context if needed and redirects to the canonical
 * workspace route. This is a compatibility fallback only — normal navigation
 * uses ROUTES.merchant.* directly (see P0-1).
 *
 * Flow:
 * 1. Check if activeStore matches requested storeId.
 * 2. If not, trigger a store switch.
 * 3. Once activeStore is synchronized, redirect to the target workspace path.
 *
 * Design notes:
 * - The shell (DashboardShell) is already rendered by the parent layout,
 *   so sidebar and topbar remain visible during the redirect.
 * - A compact inline card replaces the previous 50vh spinner.
 * - On error, redirects to the target path and lets the merchant page's
 *   WorkspaceEmptyState handle missing context gracefully.
 */
export function LegacyRouteRedirector({
  storeId,
  targetPath,
  originalRoute,
}: LegacyRouteRedirectorProps) {
  const router = useRouter();
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const switchStoreMutation = useSwitchStore();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (hasRedirected.current) return;

    const isActiveStoreMatch = activeStore && String(activeStore.id) === storeId;

    if (isActiveStoreMatch) {
      logUXEvent('redirect:legacy-route', { storeId, targetPath, originalRoute, hydrated: false });
      logger.info('[LegacyRouteRedirector] Store already active — redirecting.', {
        originalRoute,
        targetPath,
        storeId,
      });
      hasRedirected.current = true;
      router.replace(targetPath);
    } else {
      logger.info('[LegacyRouteRedirector] Store mismatch — hydrating context.', {
        originalRoute,
        targetPath,
        storeId,
        currentActiveStore: activeStore?.id,
      });

      logUXEvent('redirect:legacy-route', { storeId, targetPath, originalRoute, hydrated: true });
      switchStoreMutation.mutate(storeId, {
        onSuccess: () => {
          logger.info('[LegacyRouteRedirector] Context hydrated — redirecting.', {
            targetPath,
            storeId,
          });
          hasRedirected.current = true;
          router.replace(targetPath);
        },
        onError: (error) => {
          logger.error('[LegacyRouteRedirector] Hydration failed — redirecting to target.', {
            error,
            storeId,
            originalRoute,
            targetPath,
          });
          // Redirect to target anyway; the merchant page will show
          // WorkspaceEmptyState if the store context is still missing.
          hasRedirected.current = true;
          router.replace(targetPath);
        },
      });
    }
  }, [storeId, targetPath, activeStore, router, switchStoreMutation, originalRoute]);

  return (
    <div className="mx-auto mt-16 max-w-sm rounded-lg border bg-card p-5 text-center shadow-sm">
      <Loader2 className="mx-auto h-5 w-5 animate-spin text-primary" />
      <p className="mt-3 text-sm font-medium text-foreground">Updating workspace...</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Redirecting to the new merchant workspace.
      </p>
    </div>
  );
}
