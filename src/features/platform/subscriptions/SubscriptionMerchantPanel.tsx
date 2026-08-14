/**
 * Subscription merchant panel.
 * Shows merchant details and linked stores.
 */

import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import type { SubscriptionDetailView } from '@/types/billing/subscription';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Store } from 'lucide-react';

interface Props {
  subscription: SubscriptionDetailView;
}

export function SubscriptionMerchantPanel({ subscription }: Props) {
  const t = useTranslations('subscriptions.detail');
  const { merchant } = subscription;

  // Assuming store detail route exists at /merchant/stores/{slug}
  // If it doesn't exist yet, this will be a dead link until that page is created
  const getStoreDetailRoute = (slug: string) => `/merchant/stores/${slug}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('merchant')}</CardTitle>
        <CardDescription>{t('merchantDetails')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Merchant Info */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">{t('ownerName')}</h4>
            <p className="mt-1 font-medium">{merchant.ownerName}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">{t('ownerEmail')}</h4>
            <p className="mt-1 font-medium">{merchant.ownerEmail}</p>
          </div>
          {merchant.legalName && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">{t('legalName')}</h4>
              <p className="mt-1">{merchant.legalName}</p>
            </div>
          )}
          {merchant.billingEmail && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">{t('billingEmail')}</h4>
              <p className="mt-1">{merchant.billingEmail}</p>
            </div>
          )}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">{t('billingAccountId')}</h4>
            <p className="mt-1 font-mono text-sm">{merchant.billingAccountId}</p>
          </div>
        </div>

        {/* Stores */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-3">{t('stores')}</h4>
          {merchant.stores.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('noStores')}</p>
          ) : (
            <div className="space-y-2">
              {merchant.stores.map((store) => (
                <Link
                  key={store.id}
                  href={getStoreDetailRoute(store.slug)}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted"
                >
                  <div className="flex items-center gap-3">
                    <Store className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{store.name}</p>
                      <p className="text-xs text-muted-foreground">{store.slug}</p>
                    </div>
                  </div>
                  <Badge variant={store.status === 'active' ? 'default' : 'secondary'}>
                    {store.status}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
