/**
 * Subscription filter schemas and defaults.
 */

import type { SubscriptionFilters } from '@/types/billing/subscription';

/**
 * Default subscription filters.
 */
export const defaultSubscriptionFilters: SubscriptionFilters = {
  search: '',
  status: 'all',
  plan_id: null,
  sort: 'created_at',
  order: 'desc',
  page: 1,
  perPage: 25,
};
