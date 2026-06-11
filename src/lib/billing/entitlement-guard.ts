/**
 * Entitlement guard utilities.
 * Permission checks before allowing actions.
 */

import { checkEntitlement } from '@/lib/api/billing';
import type { EntitlementCheck } from '@/types/billing/entitlement';

/**
 * Check if user can create a product.
 * @param storeId - Store ID
 */
export async function canCreateProduct(storeId: string): Promise<EntitlementCheck> {
  try {
    return await checkEntitlement(storeId, 'products.max');
  } catch (error) {
    return {
      allowed: false,
      reason: 'Unable to verify entitlement',
    };
  }
}

/**
 * Check if user can create a store.
 */
export async function canCreateStore(): Promise<EntitlementCheck> {
  // This would need to check account-level entitlements
  // For now, return a placeholder
  return {
    allowed: true,
  };
}

/**
 * Check if a feature is enabled.
 * @param storeId - Store ID
 * @param featureKey - Feature key (e.g., 'analytics.advanced')
 */
export async function isFeatureEnabled(
  storeId: string,
  featureKey: string
): Promise<boolean> {
  try {
    const check = await checkEntitlement(storeId, featureKey);
    return check.allowed;
  } catch (error) {
    return false;
  }
}

/**
 * Get usage information for a quota.
 * @param storeId - Store ID
 * @param quotaKey - Quota key (e.g., 'products.max')
 */
export async function getQuotaUsage(
  storeId: string,
  quotaKey: string
): Promise<{ current: number; limit: number } | null> {
  try {
    const check = await checkEntitlement(storeId, quotaKey);
    if (check.current !== undefined && check.limit !== undefined) {
      return {
        current: check.current,
        limit: check.limit,
      };
    }
    return null;
  } catch (error) {
    return null;
  }
}
