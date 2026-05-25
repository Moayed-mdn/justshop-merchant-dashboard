/**
 * Canonical store contracts used by dashboard auth/bootstrap flows.
 */

export type StoreRole = 'store_admin' | 'staff' | 'super_admin' | string;

export type StoreStatus =
  | 'pending_setup'
  | 'provisioning'
  | 'active'
  | 'disabled'
  | 'suspended'
  | 'archived'
  | 'deleted_pending';

export interface Store {
  id: number;
  name: string;
  slug: string;
  domain: string | null;
  currency: string;
  role: StoreRole;
  status: StoreStatus;
  is_active: boolean;
  status_changed_at: string | null;
  created_at: string | null;
  permissions: string[];
  timezone?: string;
  updated_at?: string;
}

export type UserStore = Store;

export type ProvisioningLifecycleStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface ProvisioningStatus {
  status: ProvisioningLifecycleStatus;
  progress: number;
  current_step: string | null;
  message: string | null;
  retryable: boolean;
}

export interface CreateStorePayload {
  name: string;
  slug: string;
}
