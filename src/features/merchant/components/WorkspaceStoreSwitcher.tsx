'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectSeparator,
} from '@/components/ui/select';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { useSwitchStore } from '@/hooks/auth/useSwitchStore';
import { CheckCircle2, Loader2, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/config/routes';
import { useRouter } from '@/lib/navigation';
import { needsProvisioningFlow } from '@/lib/auth/bootstrap-routing';
import { cn } from '@/lib/utils';
import { getStoreRouteParam } from '@/lib/stores/route-param';

/**
 * Maps backend store-status values to human-readable labels and explanations.
 */
const STORE_STATUS_LABELS: Record<string, { label: string; description: string }> = {
  pending_setup: { label: 'Pending setup', description: 'Setup has not started yet.' },
  provisioning: { label: 'Setting up', description: 'Store is being set up and will be available soon.' },
  active: { label: 'Active', description: 'Store is fully operational.' },
  disabled: { label: 'Disabled', description: 'This store has been disabled.' },
  suspended: { label: 'Suspended', description: 'Store access has been temporarily suspended.' },
  archived: { label: 'Archived', description: 'This store has been archived.' },
  deleted_pending: { label: 'Deleting', description: 'Store is pending deletion.' },
};

/**
 * Workspace Store Switcher.
 * Allows switching between all merchant stores and adding new ones.
 */
export function WorkspaceStoreSwitcher() {
  const router = useRouter();
  const stores = useBootstrapStore((state) => state.stores);
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const bootstrap = useBootstrapStore((state) => state.bootstrap);
  const provisioning = useBootstrapStore((state) => state.provisioning);
  const switchStoreMutation = useSwitchStore();

  const isProvisioning = needsProvisioningFlow(bootstrap, provisioning);
  const isDisabled = switchStoreMutation.isPending || isProvisioning;

  // Use undefined (not empty string) when no active store so Base UI treats
  // the Select as uncontrolled until bootstrap resolves. An empty string value
  // causes Base UI to fire onValueChange when the value later becomes a real
  // store ID, which incorrectly triggers a store switch and redirects the user.
  const selectValue = activeStore ? getStoreRouteParam(activeStore) : undefined;

  const handleValueChange = (value: string | null) => {
    if (!value) return;

    if (value === '__create_store__') {
      router.push(ROUTES.merchant.stores.create());
      return;
    }

    // Only switch if the selected store differs from the currently active one.
    if (value !== selectValue && !isDisabled) {
      switchStoreMutation.mutate(value);
    }
  };

  if (stores.length === 0 && !isProvisioning) {
    return null;
  }

  // Get the active store name for display
  const activeStoreName = activeStore?.name || 'Select store';

  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectValue}
        disabled={isDisabled}
        onValueChange={handleValueChange}
      >
        <SelectTrigger className="min-w-56" data-testid="workspace-store-switcher">
          <div className="flex w-full items-center gap-2 overflow-hidden">
            {switchStoreMutation.isPending || isProvisioning ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : null}
            <div className="flex-1 truncate text-left">
              <span>{activeStoreName}</span>
            </div>
          </div>
        </SelectTrigger>
        <SelectContent>
          {stores.map((store) => {
            const isStoreActive = store.status === 'active' && store.is_active;
            const isCurrentStore = activeStore?.id === store.id;
            const statusInfo = STORE_STATUS_LABELS[store.status];

            return (
              <SelectItem
                key={store.id}
                value={getStoreRouteParam(store)}
                disabled={!isStoreActive}
                className={cn(!isStoreActive && 'opacity-50')}
                title={!isStoreActive && statusInfo ? statusInfo.description : undefined}
              >
                <div className="flex w-full items-center justify-between gap-4">
                  <div className="flex items-center gap-2 overflow-hidden">
                    {isCurrentStore ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    ) : null}
                    <span className="truncate">{store.name}</span>
                  </div>
                  {!isStoreActive && statusInfo ? (
                    <Badge variant="outline" className="ml-auto shrink-0 text-[10px] uppercase">
                      {statusInfo.label}
                    </Badge>
                  ) : null}
                </div>
              </SelectItem>
            );
          })}

          <SelectSeparator />

          <SelectItem value="__create_store__" className="text-primary focus:text-primary">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add store</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      {switchStoreMutation.isPending && (
        <Badge variant="outline" className="animate-pulse text-[10px] uppercase">Switching</Badge>
      )}
      {isProvisioning && (
        <Badge variant="outline" className="animate-pulse text-[10px] uppercase">Setting up</Badge>
      )}
    </div>
  );
}
