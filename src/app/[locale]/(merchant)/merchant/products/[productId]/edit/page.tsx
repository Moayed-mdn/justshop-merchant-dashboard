'use client';

import { useParams } from 'next/navigation';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { WorkspaceEmptyState } from '@/features/merchant/components/WorkspaceEmptyState';
import { useProductDetail } from '@/hooks/products/useProductDetail';
import { useTranslations } from 'next-intl';
import { EditProductSkeleton } from '@/features/products/editor/components/EditProductSkeleton';
import EditProductForm from '@/features/products/editor/components/EditProductForm';

/**
 * Merchant Workspace — Edit Product Page.
 * Canonical route: /merchant/products/[productId]/edit
 */
export default function MerchantProductEditPage() {
  const params = useParams<{ productId: string }>();
  const productId = params.productId;
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const t = useTranslations('products');

  const storeId = activeStore ? String(activeStore.id) : '';

  const { data: product, isLoading, error } = useProductDetail(storeId, productId);

  if (!activeStore) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">{t('form.editTitle')}</h1>
        </div>
        <WorkspaceEmptyState
          title="No active store"
          message="Select a store from the switcher to edit a product."
        />
      </div>
    );
  }

  if (isLoading) {
    return <EditProductSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-8 text-center">
        <p className="text-destructive">{t('table.empty')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EditProductForm product={product} storeId={storeId} />
    </div>
  );
}
