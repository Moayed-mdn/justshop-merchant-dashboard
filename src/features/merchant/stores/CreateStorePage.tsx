'use client';

import { useState } from 'react';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { CreateStoreStep } from '@/features/setup/components/CreateStoreStep';
import { WorkspaceProvisioningView } from '../components/WorkspaceProvisioningView';
import { useRouter } from '@/lib/navigation';
import { ROUTES } from '@/config/routes';
import { useEffect } from 'react';

/**
 * Create Store Page for the Merchant Workspace.
 * Handles creating additional stores for an existing merchant.
 */
export function CreateStorePage() {
  const router = useRouter();
  const stores = useBootstrapStore((state) => state.stores);
  const [showProvisioning, setShowProvisioning] = useState(false);

  useEffect(() => {
    // If merchant has zero stores, they belong in the /setup flow
    if (stores.length === 0) {
      router.push(ROUTES.setup());
    }
  }, [router, stores.length]);

  if (stores.length === 0) {
    return null; // Redirecting
  }

  if (showProvisioning) {
    return <WorkspaceProvisioningView />;
  }

  return (
    <div className="workspace-create-store-page">
      {/* 
        We reuse CreateStoreStep. 
        Note: It has some internal min-h-screen styling that we might 
        want to override in the future, but for now we follow the 
        instruction not to modify the component itself.
      */}
      <CreateStoreStep onSuccess={() => setShowProvisioning(true)} />
    </div>
  );
}
