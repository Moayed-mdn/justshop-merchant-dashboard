'use client';

import { use } from 'react';
import { LegacyRouteRedirector } from '@/features/merchant/components/LegacyRouteRedirector';
import { ROUTES } from '@/config/routes';

/**
 * Legacy Route Redirect: /stores/[storeId]/products/[productId]/edit
 * Redirects to: /merchant/products/[productId]/edit
 */
export default function LegacyProductEditPage({
  params,
}: {
  params: Promise<{ storeId: string; productId: string }>;
}) {
  const { storeId, productId } = use(params);
  
  return (
    <LegacyRouteRedirector
      storeId={storeId}
      targetPath={ROUTES.merchant.products.edit(productId)}
      originalRoute={`/stores/${storeId}/products/${productId}/edit`}
    />
  );
}
