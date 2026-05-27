'use client';

import { useEffect } from 'react';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { isBootstrapStoreReady } from '@/lib/auth/bootstrap-routing';
import { useRouter } from '@/lib/navigation';
import { ROUTES } from '@/config/routes';
import { ProvisioningStep } from '@/features/setup/components/ProvisioningStep';

/**
 * Workspace Provisioning View.
 * Wraps the standard ProvisioningStep but redirects back to the merchant workspace
 * instead of the store-specific dashboard upon completion.
 */
export function WorkspaceProvisioningView() {
  const router = useRouter();
  const bootstrap = useBootstrapStore((state) => state.bootstrap);
  const provisioning = useBootstrapStore((state) => state.provisioning);

  useEffect(() => {
    // Intercept completion redirect to keep user in workspace
    if (
      provisioning?.status === 'completed' &&
      bootstrap?.active_store &&
      isBootstrapStoreReady(bootstrap.active_store)
    ) {
      router.push(ROUTES.merchant.dashboard());
    }
  }, [bootstrap?.active_store, provisioning?.status, router]);

  return (
    <div className="workspace-provisioning-view">
      {/* 
        We reuse the ProvisioningStep component. 
        It has its own internal redirect to the store dashboard, 
        but our parent useEffect should fire first or the router.push 
        will resolve to our workspace dashboard if it's called first.
      */}
      <ProvisioningStep />
    </div>
  );
}
