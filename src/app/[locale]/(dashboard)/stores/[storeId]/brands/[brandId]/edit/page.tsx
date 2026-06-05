'use client';

import { use } from 'react';
import { LegacyRouteRedirector } from '@/features/merchant/components/LegacyRouteRedirector';
import { ROUTES } from '@/config/routes';

/**
 * Legacy Route Redirect: /stores/[storeId]/brands/[brandId]/edit
 * Redirects to: /merchant/brands/[brandId]/edit
 */
export default function LegacyBrandEditPage({
  params,
}: {
  params: Promise<{ storeId: string; brandId: string }>;
}) {
  const { storeId, brandId } = use(params);
  
  return (
    <LegacyRouteRedirector
      storeId={storeId}
      targetPath={ROUTES.merchant.brands.edit(brandId)}
      originalRoute={`/stores/${storeId}/brands/${brandId}/edit`}
    />
  );
}