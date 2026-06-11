/**
 * Product Creation Guard
 * Check quota before allowing product creation
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
 * Check if the user can create a new product
 * @param storeId - The store ID to check quota for
 * @returns QuotaCheckResult indicating if creation is allowed
 */
export async function canCreateProduct(storeId: number): Promise<QuotaCheckResult> {
  try {
    const entitlements = await getEntitlements();

    // Find the products.max feature
    const maxProducts = entitlements.features['products.max'];
    
    if (typeof maxProducts !== 'number') {
      // No limit defined, allow creation
      return {
        allowed: true,
      };
    }

    // Get current product count from limits
    const currentCount = entitlements.limits?.products_count || 0;

    if (currentCount >= maxProducts) {
      return {
        allowed: false,
        reason: 'Product limit reached',
        currentCount,
        limit: maxProducts,
        feature: 'products.max',
      };
    }

    return {
      allowed: true,
      currentCount,
      limit: maxProducts,
    };
  } catch (error) {
    // If entitlement check fails, allow creation (fail open)
    console.error('Failed to check product quota:', error);
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
export async function assertCanCreateProduct(storeId: number): Promise<void> {
  const result = await canCreateProduct(storeId);
  
  if (!result.allowed) {
    throw new Error(result.reason || 'Cannot create product');
  }
}
