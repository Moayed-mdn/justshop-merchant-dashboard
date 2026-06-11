'use client';

/**
 * Hook for fetching paginated invoices list.
 */

import { useQuery } from '@tanstack/react-query';
import { getInvoices } from '@/lib/api/billing';
import { queryKeys } from '@/lib/queryKeys';
import { QUERY_CONFIG } from '@/config/query';
import type { Invoice, InvoiceFilters } from '@/types/billing/invoice';
import type { PaginatedResponse, ApiError } from '@/types/api';

const DEFAULT_FILTERS: InvoiceFilters = {
  page: 1,
  per_page: 15,
};

export function useInvoices(filters: InvoiceFilters = DEFAULT_FILTERS) {
  return useQuery<PaginatedResponse<Invoice>, ApiError>({
    queryKey: queryKeys.billing.invoices(filters as Record<string, unknown>),
    queryFn: () => getInvoices(filters),
    staleTime: QUERY_CONFIG.staleTime,
  });
}
