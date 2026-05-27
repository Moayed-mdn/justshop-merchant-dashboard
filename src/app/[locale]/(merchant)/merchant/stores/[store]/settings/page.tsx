'use client';

import { useBootstrapStore } from '@/stores/bootstrapStore';
import { useParams } from 'next/navigation';
import { StoreSettingsForm } from '@/features/merchant/settings/StoreSettingsForm';
import { useTranslations } from 'next-intl';

/**
 * Store Settings Page.
 * Finds the store based on the URL parameter and renders the settings form.
 */
export default function MerchantStoreSettingsPage() {
  const params = useParams();
  const stores = useBootstrapStore((state) => state.stores);
  const t = useTranslations('nav');

  const storeIdentifier = params.store as string;
  
  // Find the store by ID or slug
  const store = stores.find(
    (s) => String(s.id) === storeIdentifier || s.slug === storeIdentifier
  );

  if (!store) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">{t('stores')}</h1>
        </div>
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-semibold text-destructive">Store not found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            We couldn't find the store you're looking for. It may have been deleted or you may not have access to it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{store.name} Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage configuration for {store.name}.
        </p>
      </div>

      <StoreSettingsForm store={store} />
    </div>
  );
}
