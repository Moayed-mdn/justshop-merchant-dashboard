'use client';

/**
 * Hook for fetching single invoice with line items.
 */

import { useQuery } from '@tanstack/react-query';
import { getInvoice } from '@/lib/api/billing';
import { queryKeys } from '@/lib/queryKeys';
import { QUERY_CONFIG } from '@/config/query';
import type { Invoice } from '@/types/billing/invoice';
import type { ApiError } from '@/types/api';

export function useInvoice(invoiceId: number) {
  return useQuery<Invoice, ApiError>({
    queryKey: queryKeys.billing.invoice(invoiceId),
    queryFn: () => getInvoice(invoiceId),
    staleTime: QUERY_CONFIG.staleTime,
    enabled: !!invoiceId,
  });
}
