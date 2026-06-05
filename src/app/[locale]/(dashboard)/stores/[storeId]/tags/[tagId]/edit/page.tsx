'use client';

import { use } from 'react';
import { LegacyRouteRedirector } from '@/features/merchant/components/LegacyRouteRedirector';
import { ROUTES } from '@/config/routes';

/**
 * Legacy Route Redirect: /stores/[storeId]/tags/[tagId]/edit
 * Redirects to: /merchant/tags/[tagId]/edit
 */
export default function LegacyTagEditPage({
  params,
}: {
  params: Promise<{ storeId: string; tagId: string }>;
}) {
  const { storeId, tagId } = use(params);
  
  return (
    <LegacyRouteRedirector
      storeId={storeId}
      targetPath={ROUTES.merchant.tags.edit(tagId)}
      originalRoute={`/stores/${storeId}/tags/${tagId}/edit`}
    />
  );
}
