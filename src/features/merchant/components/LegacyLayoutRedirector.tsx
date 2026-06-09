'use client';

import { useEffect, useRef } from 'react';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { useSwitchStore } from '@/hooks/auth/useSwitchStore';
import { useRouter, usePathname } from '@/lib/navigation';
import { Loader2 } from 'lucide-react';
import { logger } from '@/lib/logger';
import { logUXEvent } from '@/lib/ux-events';

interface LegacyLayoutRedirectorProps {
  storeId: string;
}

/**
 * Compatibility redirector for legacy /stores/[id]/* routes.
 *
 * Maps legacy paths to /merchant/* after ensuring the active store context
 * is hydrated. This is a compatibility fallback — normal navigation should
 * use ROUTES.merchant.* directly (see P0-1).
 *
 * Design notes:
 * - The shell (DashboardShell) is already rendered by the parent layout,
 *   so sidebar and topbar remain visible during the redirect.
 * - A compact inline card replaces the previous 80vh spinner for a more
 *   contained, less dominant presence.
 * - On error, redirects to the target path and lets the merchant page's
 *   WorkspaceEmptyState handle missing context gracefully.
 */
export function LegacyLayoutRedirector({ storeId }: LegacyLayoutRedirectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const switchStoreMutation = useSwitchStore();
  const hasRedirected = useRef(false);

  // Map the legacy pathname to the workspace pathname
  // Example: /stores/123/products/new -> /merchant/products/new
  const getTargetPath = (path: string, id: string) => {
    let target = path.replace(`/stores/${id}`, '/merchant');
    if (target.includes('/merchant/users')) {
      target = target.replace('/merchant/users', '/merchant/customers');
    }
    return target;
  };

  useEffect(() => {
    if (hasRedirected.current) return;

    const targetPath = getTargetPath(pathname, storeId);
    const isActiveStoreMatch = activeStore && String(activeStore.id) === storeId;

    if (isActiveStoreMatch) {
      logUXEvent('redirect:legacy-layout', { storeId, targetPath, pathname, hydrated: false });
      logger.info('[LegacyLayoutRedirector] Store already active — redirecting.', {
        pathname,
        targetPath,
        storeId,
      });
      hasRedirected.current = true;
      router.replace(targetPath);
    } else {
      logger.info('[LegacyLayoutRedirector] Store mismatch — hydrating context.', {
        pathname,
        targetPath,
        storeId,
        currentActiveStore: activeStore?.id,
      });

      logUXEvent('redirect:legacy-layout', { storeId, targetPath, pathname, hydrated: true });
      switchStoreMutation.mutate(storeId, {
        onSuccess: () => {
          logger.info('[LegacyLayoutRedirector] Context hydrated — redirecting.', {
            targetPath,
            storeId,
          });
          hasRedirected.current = true;
          router.replace(targetPath);
        },
        onError: (error) => {
          logger.error('[LegacyLayoutRedirector] Hydration failed — redirecting to target.', {
            error,
            storeId,
            pathname,
            targetPath,
          });
          // Redirect to target anyway; the merchant page will show
          // WorkspaceEmptyState if the store context is still missing.
          hasRedirected.current = true;
          router.replace(targetPath);
        },
      });
    }
  }, [storeId, pathname, activeStore, router, switchStoreMutation]);

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
