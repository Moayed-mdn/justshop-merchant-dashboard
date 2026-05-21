'use client';

import { useEffect } from 'react';
import { useStoreStore } from '@/stores/storeStore';

interface TenantInitializerProps {
  tenantSlug: string | null;
}

/**
 * Client component to sync tenant context from headers (via RSC) to Zustand.
 */
export function TenantInitializer({ tenantSlug }: TenantInitializerProps) {
  useEffect(() => {
    useStoreStore.getState().setTenantContext(tenantSlug);
  }, [tenantSlug]);

  return null;
}
