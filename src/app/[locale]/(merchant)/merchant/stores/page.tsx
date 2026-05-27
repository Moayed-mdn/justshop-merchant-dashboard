'use client';

import { useBootstrapStore } from '@/stores/bootstrapStore';
import { StoreList } from '@/features/merchant/stores/StoreList';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/lib/navigation';
import { ROUTES } from '@/config/routes';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

/**
 * Merchant Workspace Stores Page.
 * Lists all stores owned by the merchant.
 */
export default function MerchantStoresPage() {
  const stores = useBootstrapStore((state) => state.stores);
  const t = useTranslations('nav');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('stores')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your stores and businesses.
          </p>
        </div>
        <Link 
          href={ROUTES.merchant.stores.create()}
          className={cn(buttonVariants({ variant: 'default' }))}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create store
        </Link>
      </div>

      <StoreList stores={stores} />
    </div>
  );
}
