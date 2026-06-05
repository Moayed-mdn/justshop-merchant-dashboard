'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { WorkspaceEmptyState } from '@/features/merchant/components/WorkspaceEmptyState';
import EditHeroBannerForm from '@/features/dashboard/hero-banners/EditHeroBannerForm';
import { getHeroBanner } from '@/lib/api/hero-banners';
import { logger } from '@/lib/logger';

/**
 * Merchant Workspace — Edit Hero Banner Page.
 * Canonical route: /merchant/hero-banners/[id]/edit
 */
export default function MerchantHeroBannerEditPage() {
  const params = useParams<{ id: string }>();
  const bannerId = params.id;
  const activeStore = useBootstrapStore((state) => state.activeStore);

  const storeId = activeStore ? String(activeStore.id) : '';

  // Fetch banner data
  const { data: banner, isLoading, error } = useQuery({
    queryKey: ['hero-banner', storeId, bannerId],
    queryFn: () => getHeroBanner(storeId, bannerId),
    enabled: !!storeId && !!bannerId,
  });

  if (!activeStore) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Edit Hero Banner</h1>
        </div>
        <WorkspaceEmptyState
          title="No active store"
          message="Select a store from the switcher to edit this hero banner."
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Edit Hero Banner</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    logger.error('Failed to load hero banner', { error, bannerId });
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Edit Hero Banner</h1>
        </div>
        <WorkspaceEmptyState
          title="Failed to load banner"
          message="Could not load the hero banner. Please try again."
        />
      </div>
    );
  }

  if (!banner) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Edit Hero Banner</h1>
        </div>
        <WorkspaceEmptyState
          title="Banner not found"
          message="The requested hero banner could not be found."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EditHeroBannerForm storeId={storeId} bannerId={bannerId} banner={banner} />
    </div>
  );
}
