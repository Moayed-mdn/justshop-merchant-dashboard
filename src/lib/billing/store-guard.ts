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
    const data = await getEntitlements();

    const usage = (data as any)?.usage;
    const maxStores = usage?.stores?.limit;
    const currentCount = usage?.stores?.count ?? 0;

    if (typeof maxStores !== 'number') {
      return {
        allowed: true,
      };
    }

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
