'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Info, Loader2, AlertCircle } from 'lucide-react';
import { clientApi } from '@/lib/api/client';
import { API_ROUTES } from '@/config/routes';
import type { SectionSchemaSetting } from '@/types/theme';

interface NavigationMenuOption {
  id: number;
  name: string;
  handle: string;
}

interface LinkListSettingProps {
  storeSlug: string;
  setting: SectionSchemaSetting;
  value: string;
  onChange: (value: string) => void;
}

export function LinkListSetting({ storeSlug, setting, value, onChange }: LinkListSettingProps) {
  const t = useTranslations();

  const { data: menus, isLoading, isError } = useQuery({
    queryKey: ['merchant', storeSlug, 'navigation-menus', 'all'],
    queryFn: async () => {
      const response = await clientApi.get<{ data: NavigationMenuOption[] }>(
        API_ROUTES.store(storeSlug).navigation().list(),
        { params: { per_page: 100 } }
      );

      return (response.data ?? []).map((menu) => ({
        id: menu.id,
        name: menu.name,
        handle: menu.handle,
      }));
    },
    enabled: !!storeSlug,
    staleTime: 5 * 60 * 1000,
  });

  console.log('[LinkListSetting] Menus:', menus);

  return (
    <div className="space-y-2">
      <Label htmlFor={setting.id}>{setting.label}</Label>
      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          {t('loading')}
        </div>
      ) : isError ? (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-3 w-3" />
          {t('errorLoading')}
        </div>
      ) : (
        <Select
          value={value}
          onValueChange={(v) => v !== null && onChange(v)}
        >
          <SelectTrigger id={setting.id}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(menus ?? []).map((menu: NavigationMenuOption) => (
              <SelectItem key={menu.id} value={menu.handle}>
                {menu.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {setting.info && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Info className="h-3 w-3" />
          {setting.info}
        </p>
      )}
    </div>
  );
}
