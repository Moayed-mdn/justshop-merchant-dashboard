'use client';

import { useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { useSwitchStore } from '@/hooks/auth/useSwitchStore';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function StoreSwitcher() {
  const stores = useBootstrapStore((state) => state.stores);
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const switchStoreMutation = useSwitchStore();

  const isDisabled = stores.length <= 1 || switchStoreMutation.isPending;
  const selectValue = activeStore ? String(activeStore.id) : '';

  const selectableStores = useMemo(
    () => stores.filter((store) => store.status === 'active' && store.is_active),
    [stores]
  );

  if (stores.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectValue}
        disabled={isDisabled}
        onValueChange={(nextStoreId) => {
          if (nextStoreId && nextStoreId !== selectValue && !switchStoreMutation.isPending) {
            switchStoreMutation.mutate(nextStoreId);
          }
        }}
      >
        <SelectTrigger className="min-w-44" data-testid="store-switcher">
          <div className="flex w-full items-center gap-2">
            {switchStoreMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : null}
            <SelectValue placeholder="Select store" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {selectableStores.map((store) => (
            <SelectItem key={store.id} value={String(store.id)}>
              {store.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {switchStoreMutation.isPending ? (
        <Badge variant="outline">Syncing</Badge>
      ) : null}
    </div>
  );
}
