'use client';

import { useParams } from 'next/navigation';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { WorkspaceEmptyState } from '@/features/merchant/components/WorkspaceEmptyState';
import { useBrandDetail } from '@/hooks/brands/useBrandDetail';
import { useTranslations } from 'next-intl';
import { EditBrandSkeleton } from '@/features/dashboard/brands/EditBrandSkeleton';
import EditBrandContent from '@/features/dashboard/brands/EditBrandContent';
import { getStoreRouteParam } from '@/lib/stores/route-param';

/**
 * Merchant Workspace — Edit Brand Page.
 * Canonical route: /merchant/brands/[id]/edit
 */
export default function MerchantBrandEditPage() {
  const params = useParams<{ id: string }>();
  const brandId = params.id;
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const t = useTranslations('brands');

  const storeSlug = getStoreRouteParam(activeStore);

  const { data: brand, isLoading, error } = useBrandDetail(storeSlug, brandId);

  if (!activeStore) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">{t('form.editTitle')}</h1>
        </div>
        <WorkspaceEmptyState />
      </div>
    );
  }

  if (isLoading) {
    return <EditBrandSkeleton />;
  }

  if (error || !brand) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-8 text-center">
        <p className="text-destructive">{t('detail.error')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EditBrandContent storeSlug={storeSlug} brandId={brandId} />
    </div>
  );
}
