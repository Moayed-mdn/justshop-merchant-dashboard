'use client';

import { useBootstrapStore } from '@/stores/bootstrapStore';
import { WorkspaceEmptyState } from '@/features/merchant/components/WorkspaceEmptyState';
import CreateHeroBannerForm from '@/features/dashboard/hero-banners/CreateHeroBannerForm';

/**
 * Merchant Workspace — Create Hero Banner Page.
 * Canonical route: /merchant/hero-banners/new
 */
export default function MerchantHeroBannerCreatePage() {
  const activeStore = useBootstrapStore((state) => state.activeStore);

  const storeId = activeStore ? String(activeStore.id) : '';

  if (!activeStore) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Create Hero Banner</h1>
        </div>
        <WorkspaceEmptyState
          title="No active store"
          message="Select a store from the switcher to create a hero banner."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CreateHeroBannerForm storeId={storeId} />
    </div>
  );
}
