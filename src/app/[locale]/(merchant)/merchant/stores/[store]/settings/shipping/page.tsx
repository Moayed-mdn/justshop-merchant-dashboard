'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShippingMethodsList } from '@/features/merchant/shipping/ShippingMethodsList';
import { ShippingZonesList } from '@/features/merchant/shipping/ShippingZonesList';
import { AddressSettingsForm } from '@/features/merchant/shipping/AddressSettingsForm';
import { matchesStoreIdentifier } from '@/lib/stores/route-param';

/**
 * Shipping Settings Page.
 * Allows merchants to manage shipping methods, zones, and address validation.
 */
export default function ShippingSettingsPage() {
  const params = useParams();
  const stores = useBootstrapStore((state) => state.stores);
  const storeSlug = params.store as string;
  const t = useTranslations('shipping');
  const tSettings = useTranslations('settings');

  // Match store identifier via slug only.
  const store = stores.find((s) => matchesStoreIdentifier(s, storeSlug));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{store?.name} {tSettings('title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {tSettings('description', { storeName: store?.name || 'Store' })}
        </p>
      </div>

      <Tabs defaultValue="methods" className="space-y-6">
        <TabsList>
          <TabsTrigger value="methods">{t('tabs.methods')}</TabsTrigger>
          <TabsTrigger value="zones">{t('tabs.zones')}</TabsTrigger>
          <TabsTrigger value="settings">{t('tabs.settings')}</TabsTrigger>
        </TabsList>

        <TabsContent value="methods" className="space-y-4">
          <ShippingMethodsList storeSlug={storeSlug} />
        </TabsContent>

        <TabsContent value="zones" className="space-y-4">
          <ShippingZonesList storeSlug={storeSlug} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <AddressSettingsForm storeSlug={storeSlug} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
