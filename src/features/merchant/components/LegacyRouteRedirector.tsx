'use client';

import { useEffect, useRef } from 'react';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { useSwitchStore } from '@/hooks/auth/useSwitchStore';
import { useRouter } from '@/lib/navigation';
import { Loader2 } from 'lucide-react';
import { logger } from '@/lib/logger';

interface LegacyRouteRedirectorProps {
  storeId: string;
  targetPath: string;
  originalRoute: string;
}

/**
 * Compatibility adapter for legacy store-scoped routes.
 * Hydrates the active store context if needed and redirects to the canonical workspace route.
 * 
 * Flow:
 * 1. Check if activeStore matches requested storeId.
 * 2. If not, trigger a store switch.
 * 3. Once activeStore is synchronized, redirect to the target workspace path.
 */
export function LegacyRouteRedirector({ 
  storeId, 
  targetPath,
  originalRoute 
}: LegacyRouteRedirectorProps) {
  const router = useRouter();
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const switchStoreMutation = useSwitchStore();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (hasRedirected.current) return;

    const isActiveStoreMatch = activeStore && String(activeStore.id) === storeId;

    if (isActiveStoreMatch) {
      logger.info('Legacy route access: store already active. Redirecting to workspace.', {
        originalRoute,
        targetPath,
        storeId,
      });
      hasRedirected.current = true;
      router.replace(targetPath);
    } else {
      logger.info('Legacy route access: store mismatch. Hydrating context...', {
        originalRoute,
        targetPath,
        storeId,
        currentActiveStore: activeStore?.id,
      });
      
      // Trigger store switch. The useSwitchStore hook handles the API call,
      // state update, and cache invalidation.
      switchStoreMutation.mutate(storeId, {
        onSuccess: () => {
          logger.info('Legacy context hydrated successfully. Redirecting to workspace.', {
            targetPath,
            storeId,
          });
          hasRedirected.current = true;
          router.replace(targetPath);
        },
        onError: (error) => {
          logger.error('Failed to hydrate legacy context. Redirecting to target anyway.', {
            error,
            storeId,
            originalRoute,
            targetPath
          });
          // Redirect to target path anyway - the target page will handle
          // "no active store" state gracefully with WorkspaceEmptyState
          hasRedirected.current = true;
          router.replace(targetPath);
        }
      });
    }
  }, [storeId, targetPath, activeStore, router, switchStoreMutation, originalRoute]);

  return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Switching Workspace Context</h2>
        <p className="text-sm text-muted-foreground">
          We're moving you to the new merchant workspace for Store #{storeId}...
        </p>
      </div>
    </div>
  );
}
