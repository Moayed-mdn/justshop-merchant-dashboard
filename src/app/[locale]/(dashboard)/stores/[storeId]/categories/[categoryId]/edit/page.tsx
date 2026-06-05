'use client';

import { use } from 'react';
import { LegacyRouteRedirector } from '@/features/merchant/components/LegacyRouteRedirector';
import { ROUTES } from '@/config/routes';

/**
 * Legacy Route Redirect: /stores/[storeId]/categories/[categoryId]/edit
 * Redirects to: /merchant/categories/[categoryId]/edit
 */
export default function LegacyCategoryEditPage({
  params,
}: {
  params: Promise<{ storeId: string; categoryId: string }>;
}) {
  const { storeId, categoryId } = use(params);
  
  return (
    <LegacyRouteRedirector
      storeId={storeId}
      targetPath={ROUTES.merchant.categories.edit(categoryId)}
      originalRoute={`/stores/${storeId}/categories/${categoryId}/edit`}
    />
  );
}