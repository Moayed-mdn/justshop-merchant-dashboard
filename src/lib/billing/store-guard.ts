/**
 * Store Creation Guard
 * Check store limit before allowing store creation
 */

import { getEntitlements } from '@/lib/api/billing';

export interface QuotaCheckResult {
  allowed: boolean;
  reason?: string;
  currentCount?: number;
  limit?: number;
  feature?: string;
}

/**
 * Check if the user can create a new store
 * @returns QuotaCheckResult indicating if creation is allowed
 */
export async function canCreateStore(): Promise<QuotaCheckResult> {
  try {
    const entitlements = await getEntitlements();

    // Find the stores.max feature
    const maxStores = entitlements.features['stores.max'];
    
    if (typeof maxStores !== 'number') {
      // No limit defined, allow creation
      return {
        allowed: true,
      };
    }

    // Get current store count from limits
    const currentCount = entitlements.limits?.stores_count || 0;

    if (currentCount >= maxStores) {
      return {
        allowed: false,
        reason: 'Store limit reached',
        currentCount,
        limit: maxStores,
        feature: 'stores.max',
      };
    }

    return {
      allowed: true,
      currentCount,
      limit: maxStores,
    };
  } catch (error) {
    // If entitlement check fails, allow creation (fail open)
    console.error('Failed to check store quota:', error);
    return {
      allowed: true,
      reason: 'Unable to verify quota',
    };
  }
}

/**
 * Client-side version that throws on quota exceeded
 * Use this in client components for immediate feedback
 */
export async function assertCanCreateStore(): Promise<void> {
  const result = await canCreateStore();
  
  if (!result.allowed) {
    throw new Error(result.reason || 'Cannot create store');
  }
}
