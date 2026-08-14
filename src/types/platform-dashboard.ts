/**
 * Platform Dashboard types.
 * Raw API shapes (camelCase from PlatformDashboardStatsResource) and mapped view shapes.
 */

/**
 * Raw API response shape for platform dashboard stats (camelCase from backend resource).
 */
export interface PlatformDashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalStores: number;
  activeStores: number;
  pendingStores: number;
  suspendedStores: number;
  totalRevenue: number;
  revenueThisMonth: number;
  totalLeads: number;
  totalOrders: number;
  ordersThisMonth: number;
  pendingOrders: number;
  usersTrend: TrendData;
  storesTrend: TrendData;
  revenueTrend: TrendData;
  ordersTrend: TrendData;
  leadsTrend: TrendData;
  // New subscription fields
  totalSubscriptions: number;
  activeSubscriptions: number;
  trialingSubscriptions: number;
  pastDueSubscriptions: number;
  canceledSubscriptions: number;
  subscriptionsThisMonth: number;
  subscriptionsTrend: TrendData;
  totalSubscriptionRevenue: number;
  subscriptionRevenueThisMonth: number;
  subscriptionRevenueTrend: TrendData;
}

export interface TrendData {
  change: number;
  direction: 'up' | 'down' | 'neutral';
}

/**
 * Mapped view shape for platform dashboard stats UI.
 */
export interface PlatformDashboardStatsView {
  // Store Activity section
  totalOrders: string;
  pendingOrders: string;
  totalRevenue: string;
  revenueThisMonth: string;
  revenueTrend: TrendData;
  totalStores: string;
  activeStores: string;
  pendingStores: string;
  suspendedStores: string;
  
  // Platform Revenue section
  totalSubscriptionRevenue: string;
  subscriptionRevenueThisMonth: string;
  subscriptionRevenueTrend: TrendData;
  totalSubscriptions: string;
  activeSubscriptions: string;
  trialingSubscriptions: string;
  pastDueSubscriptions: string;
  canceledSubscriptions: string;
}
