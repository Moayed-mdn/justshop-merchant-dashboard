'use client';

import { useBootstrapStore } from '@/stores/bootstrapStore';
import { StoreList } from '@/features/merchant/stores/StoreList';
import { MerchantPageHeader } from '@/features/merchant/components/MerchantPageHeader';
import { Button } from '@/components/ui/button';
import { Link } from '@/lib/navigation';
import { ROUTES } from '@/config/routes';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

/**
 * Merchant Workspace Stores Page.
 * Lists all stores owned by the merchant.
 */
export default function MerchantStoresPage() {
  const stores = useBootstrapStore((state) => state.stores);
  const t = useTranslations('stores');

  return (
    <div className="space-y-6">
      <MerchantPageHeader
        title={t('title')}
        description={t('subtitle')}
      >
        <Link href={ROUTES.merchant.stores.create()}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('createButton')}
          </Button>
        </Link>
      </MerchantPageHeader>

      <StoreList stores={stores} />
    </div>
  );
}
