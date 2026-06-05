'use client';

import { useBootstrapStore } from '@/stores/bootstrapStore';
import { WorkspaceEmptyState } from '@/features/merchant/components/WorkspaceEmptyState';
import HeroBannersContent from '@/features/dashboard/hero-banners/HeroBannersContent';

/**
 * Merchant Workspace — Hero Banners list.
 * Displays all hero banners for the currently active store.
 */
export default function MerchantHeroBannersPage() {
  const activeStore = useBootstrapStore((state) => state.activeStore);

  if (!activeStore) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Hero Banners</h1>
        </div>
        <WorkspaceEmptyState
          title="No active store"
          message="Select a store from the switcher to manage hero banners."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <HeroBannersContent storeId={String(activeStore.id)} />
    </div>
  );
}
