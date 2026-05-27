'use client';

import { useBootstrapStore } from '@/stores/bootstrapStore';
import { useSwitchStore } from '@/hooks/auth/useSwitchStore';
import type { Store } from '@/types/store';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Link, useRouter } from '@/lib/navigation';
import { ROUTES } from '@/config/routes';
import { Settings, ExternalLink, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StoreListItemProps {
  store: Store;
}

/**
 * Individual store item for the stores list.
 */
export function StoreListItem({ store }: StoreListItemProps) {
  const router = useRouter();
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const switchStoreMutation = useSwitchStore();
  
  const isReady = store.status === 'active' && store.is_active;
  const isActive = activeStore?.id === store.id;
  const isSwitching = switchStoreMutation.isPending && switchStoreMutation.variables === String(store.id);

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
    switchStoreMutation.mutate(String(store.id));
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
            isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
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
            <Badge variant={getStatusVariant(store.status)} className="text-[10px] uppercase">
              {store.status.replace('_', ' ')}
            </Badge>
            {isActive && (
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1 text-[10px] uppercase">
                <CheckCircle2 className="h-3 w-3" />
                Active
              </Badge>
            )}
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {store.slug}.{process.env.NEXT_PUBLIC_BASE_DOMAIN || 'localhost'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isReady && (
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
              href={ROUTES.merchant.stores.settings(String(store.id))}
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
