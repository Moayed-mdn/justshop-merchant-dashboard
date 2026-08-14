/**
 * Platform Dashboard mappers.
 * Transform raw API data to view shapes for UI components.
 */

import type { 
  PlatformDashboardStats, 
  PlatformDashboardStatsView 
} from '@/types/platform-dashboard';

/**
 * Format currency amount (dollars) to display string.
 */
function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format count to display string with commas.
 */
function formatCount(count: number): string {
  return new Intl.NumberFormat('en-US').format(count);
}

/**
 * Map platform dashboard stats from API to view shape.
 */
export function mapPlatformDashboardStats(
  data: PlatformDashboardStats,
  currency: string = 'USD'
): PlatformDashboardStatsView {
  return {
    // Store Activity section
    totalOrders: formatCount(data.totalOrders),
    pendingOrders: formatCount(data.pendingOrders),
    totalRevenue: formatCurrency(data.totalRevenue, currency),
    revenueThisMonth: formatCurrency(data.revenueThisMonth, currency),
    revenueTrend: data.revenueTrend,
    totalStores: formatCount(data.totalStores),
    activeStores: formatCount(data.activeStores),
    pendingStores: formatCount(data.pendingStores),
    suspendedStores: formatCount(data.suspendedStores),
    
    // Platform Revenue section
    totalSubscriptionRevenue: formatCurrency(data.totalSubscriptionRevenue, currency),
    subscriptionRevenueThisMonth: formatCurrency(data.subscriptionRevenueThisMonth, currency),
    subscriptionRevenueTrend: data.subscriptionRevenueTrend,
    totalSubscriptions: formatCount(data.totalSubscriptions),
    activeSubscriptions: formatCount(data.activeSubscriptions),
    trialingSubscriptions: formatCount(data.trialingSubscriptions),
    pastDueSubscriptions: formatCount(data.pastDueSubscriptions),
    canceledSubscriptions: formatCount(data.canceledSubscriptions),
  };
}
