'use client';

import { useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { useSwitchStore } from '@/hooks/auth/useSwitchStore';
import { Loader2, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRouter } from '@/lib/navigation';
import { ROUTES } from '@/config/routes';

export function StoreSwitcher() {
  const router = useRouter();
  const stores = useBootstrapStore((state) => state.stores);
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const switchStoreMutation = useSwitchStore();

  const isDisabled = switchStoreMutation.isPending;
  const selectValue = activeStore ? String(activeStore.id) : '';

  const selectableStores = useMemo(
    () => stores.filter((store) => store.status === 'active' && store.is_active),
    [stores]
  );

  const handleValueChange = (value: string | null) => {
    if (!value) return;

    if (value === '__create_store__') {
      router.push(ROUTES.merchant.stores.create());
      return;
    }

    if (value && value !== selectValue && !switchStoreMutation.isPending) {
      switchStoreMutation.mutate(value);
    }
  };

  if (stores.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectValue}
        disabled={isDisabled}
        onValueChange={handleValueChange}
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
          
          <SelectSeparator />
          
          <SelectItem value="__create_store__" className="text-primary focus:text-primary">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add store</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      {switchStoreMutation.isPending ? (
        <Badge variant="outline" className="text-[10px] uppercase">Switching</Badge>
      ) : null}
    </div>
  );
}
