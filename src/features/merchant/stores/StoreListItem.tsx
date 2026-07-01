'use client';

import { useBootstrapStore } from '@/stores/bootstrapStore';
import { useSwitchStore } from '@/hooks/auth/useSwitchStore';
import type { Store } from '@/types/store';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Link } from '@/lib/navigation';
import { ROUTES } from '@/config/routes';
import { Settings, ExternalLink, CheckCircle2, Loader2, Clock, Ban, Archive } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getStoreRouteParam } from '@/lib/stores/route-param';

const STORE_STATUS_INFO: Record<string, { label: string; description: string }> = {
  pending_setup: { label: 'Pending setup', description: 'Setup has not started yet.' },
  provisioning: { label: 'Setting up', description: 'Store is being set up and will be available soon.' },
  active: { label: 'Active', description: 'Store is fully operational.' },
  disabled: { label: 'Disabled', description: 'This store has been disabled.' },
  suspended: { label: 'Suspended', description: 'Store access has been temporarily suspended.' },
  archived: { label: 'Archived', description: 'This store has been archived.' },
  deleted_pending: { label: 'Deleting', description: 'Store is pending deletion.' },
};

function StatusIcon({ status }: { status: Store['status'] }) {
  switch (status) {
    case 'provisioning':
    case 'pending_setup':
      return <Clock className="h-3 w-3" />;
    case 'disabled':
    case 'suspended':
      return <Ban className="h-3 w-3" />;
    case 'archived':
      return <Archive className="h-3 w-3" />;
    default:
      return null;
  }
}

interface StoreListItemProps {
  store: Store;
}

/**
 * Individual store item for the stores list.
 */
export function StoreListItem({ store }: StoreListItemProps) {
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const switchStoreMutation = useSwitchStore();
  
  const isReady = store.status === 'active' && store.is_active;
  const isActive = activeStore?.id === store.id;
  const isSwitching = switchStoreMutation.isPending && switchStoreMutation.variables === getStoreRouteParam(store);
  const statusInfo = STORE_STATUS_INFO[store.status];

  const getStatusVariant = (status: Store['status']) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'provisioning':
      case 'pending_setup':
        return 'outline';
      case 'disabled':
      case 'suspended':
        return 'destructive';
      case 'archived':
      default:
        return 'secondary';
    }
  };

  const handleSwitch = () => {
    if (isActive || !isReady || switchStoreMutation.isPending) return;
    switchStoreMutation.mutate(getStoreRouteParam(store));
  };

  return (
    <div 
      className={cn(
        "flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm transition-all",
        isActive ? "border-primary ring-1 ring-primary/20" : "hover:border-primary/20"
      )}
    >
      <div className="flex items-center gap-4 overflow-hidden">
        <div 
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            isActive ? "bg-primary text-primary-foreground" : "bg-muted-bg text-muted-foreground"
          )}
        >
          <span className="text-lg font-bold">
            {store.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <div className="flex items-center gap-2">
            <h4 
              className={cn(
                "truncate font-semibold",
                isReady && !isActive && "cursor-pointer hover:text-primary transition-colors"
              )}
              onClick={isReady && !isActive ? handleSwitch : undefined}
            >
              {store.name}
            </h4>
            {isActive ? (
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1 text-[10px] uppercase">
                <CheckCircle2 className="h-3 w-3" />
                Active
              </Badge>
            ) : (
              <Badge variant={getStatusVariant(store.status)} className="flex items-center gap-1 text-[10px] uppercase">
                <StatusIcon status={store.status} />
                {statusInfo?.label ?? store.status.replace('_', ' ')}
              </Badge>
            )}
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {store.slug}.{process.env.NEXT_PUBLIC_BASE_DOMAIN || 'localhost'}
          </p>
          {!isReady && statusInfo ? (
            <p className="mt-1 text-xs text-muted-foreground">{statusInfo.description}</p>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isReady ? (
          <>
            {!isActive ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSwitch}
                disabled={switchStoreMutation.isPending}
                className="hidden sm:flex"
              >
                {isSwitching ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ExternalLink className="mr-2 h-4 w-4" />
                )}
                Switch to store
              </Button>
            ) : (
              <Link 
                href={ROUTES.merchant.dashboard()}
                className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), "hidden sm:flex")}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            )}
            
            <Link 
              href={ROUTES.merchant.stores.settings(getStoreRouteParam(store))}
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </>
        ) : (
          <span className="hidden sm:block text-xs text-muted-foreground max-w-40 text-right leading-tight">
            {statusInfo?.description ?? 'Store is not available.'}
          </span>
        )}
      </div>
    </div>
  );
}
