/**
 * Billing utility functions.
 * Helper functions for formatting and calculations.
 */

import type { SubscriptionStatus } from '@/types/billing/subscription';
import type { EntitlementStatus } from '@/types/billing/entitlement';

/**
 * Format cents to currency string.
 * @param cents - Amount in cents
 * @param currency - ISO currency code (USD, EUR, etc.)
 */
export function formatCurrency(cents: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

/**
 * Format date to locale string.
 * @param dateString - ISO date string
 * @param locale - Locale code (default: 'en-US')
 */
export function formatDate(
  dateString: string,
  locale = 'en-US'
): string {
  return new Date(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Calculate days remaining until a date.
 * @param dateString - ISO date string
 */
export function daysUntil(dateString: string): number {
  const targetDate = new Date(dateString);
  const now = new Date();
  const diffTime = targetDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if subscription grants full access.
 */
export function hasFullAccess(status: SubscriptionStatus): boolean {
  return ['trialing', 'active', 'canceled'].includes(status);
}

/**
 * Check if subscription grants read-only access.
 */
export function hasReadOnlyAccess(status: SubscriptionStatus): boolean {
  return ['past_due', 'grace_period'].includes(status);
}

/**
 * Check if subscription is blocked.
 */
export function isBlocked(status: SubscriptionStatus): boolean {
  return ['paused', 'expired', 'incomplete', 'incomplete_expired'].includes(status);
}

/**
 * Get user-friendly subscription status label.
 */
export function getStatusLabel(status: SubscriptionStatus): string {
  const labels: Record<SubscriptionStatus, string> = {
    incomplete: 'Incomplete',
    trialing: 'Free Trial',
    active: 'Active',
    past_due: 'Payment Failed',
    grace_period: 'Grace Period',
    paused: 'Paused',
    canceled: 'Canceled',
    expired: 'Expired',
  };
  return labels[status] || status;
}

/**
 * Get user-friendly entitlement status label.
 */
export function getEntitlementLabel(status: EntitlementStatus): string {
  const labels: Record<EntitlementStatus, string> = {
    TRIALING: 'Trial',
    ENTITLED: 'Active',
    READ_ONLY: 'Read Only',
    RESTRICTED: 'Restricted',
    NONE: 'No Access',
    GRANDFATHERED: 'Grandfathered',
  };
  return labels[status] || status;
}

/**
 * Calculate percentage usage.
 * @param current - Current usage
 * @param limit - Maximum limit
 */
export function calculateUsagePercentage(current: number, limit: number): number {
  if (limit === 0) return 0;
  return Math.min(Math.round((current / limit) * 100), 100);
}

/**
 * Get progress color based on usage percentage.
 */
export function getUsageColor(percentage: number): 'success' | 'warning' | 'danger' {
  if (percentage >= 90) return 'danger';
  if (percentage >= 75) return 'warning';
  return 'success';
}
