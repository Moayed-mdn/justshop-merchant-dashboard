'use client';

import { useEffect, useRef } from 'react';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { useSwitchStore } from '@/hooks/auth/useSwitchStore';
import { useRouter, usePathname } from '@/lib/navigation';
import { Loader2 } from 'lucide-react';
import { logger } from '@/lib/logger';

interface LegacyLayoutRedirectorProps {
  storeId: string;
}

/**
 * Universal redirector for the legacy store shell.
 * Maps any /stores/[id]/* route to its /merchant/* equivalent
 * after ensuring the active store context is hydrated.
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
    // Handle the case where the path is /stores/123/users (mapped to customers)
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
      logger.info('Legacy shell access: store already active. Redirecting to workspace.', {
        pathname,
        targetPath,
        storeId,
      });
      hasRedirected.current = true;
      router.replace(targetPath);
    } else {
      logger.info('Legacy shell access: store mismatch. Hydrating context...', {
        pathname,
        targetPath,
        storeId,
        currentActiveStore: activeStore?.id,
      });
      
      switchStoreMutation.mutate(storeId, {
        onSuccess: () => {
          logger.info('Legacy context hydrated. Redirecting to workspace.', {
            targetPath,
            storeId,
          });
          hasRedirected.current = true;
          router.replace(targetPath);
        },
        onError: (error) => {
          logger.error('Failed to hydrate legacy context from layout', {
            error,
            storeId,
            pathname,
          });
          router.replace('/merchant/dashboard');
        }
      });
    }
  }, [storeId, pathname, activeStore, router, switchStoreMutation]);

  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4 text-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Updating Workspace Context</h2>
        <p className="max-w-xs text-muted-foreground">
          We're moving your session to the new merchant workspace for Store #{storeId}...
        </p>
      </div>
    </div>
  );
}
