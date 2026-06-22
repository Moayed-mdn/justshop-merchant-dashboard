'use client';

/**
 * Navigation Menu Editor.
 * Main editor component with drag-and-drop menu tree.
 */

import { useEffect, useState } from 'react';
import { useNavigationMenu } from '@/hooks/navigation/useNavigationMenu';
import { useUpdateNavigationMenu } from '@/hooks/navigation/useNavigationMenuMutations';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import { ROUTES } from '@/config/routes';
import { ArrowLeft, Save } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';
import MenuItemsTree from './MenuItemsTree';
import NavigationHealthWidget from './NavigationHealthWidget';
import type { UpdateNavigationMenuPayload } from '@/types/navigation';

interface Props {
  storeId: string;
  menuId: string;
}

export default function NavigationMenuEditor({ storeId, menuId }: Props) {
  const t = useTranslations('theme.navigation.editor');
  const { data: menu, isLoading, error } = useNavigationMenu(storeId, menuId);
  const updateMutation = useUpdateNavigationMenu(storeId, menuId);

  const [formData, setFormData] = useState<UpdateNavigationMenuPayload | null>(null);

  useEffect(() => {
    if (!menu) {
      return;
    }

    setFormData({
      name: menu.name,
      handle: menu.handle,
      description: menu.description,
    });
  }, [menu]);

  const handleSave = () => {
    if (!formData) return;

    updateMutation.mutate(formData, {
      onSuccess: () => {
        toast.success(t('saveSuccess'));
      },
      onError: (err: any) => {
        logger.error('Failed to update navigation menu', { error: err });
        toast.error(err?.message ?? t('saveError'));
      },
    });
  };

  if (error) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
        <p className="text-destructive">{error.message || t('loadError')}</p>
      </div>
    );
  }

  if (isLoading || !menu || !formData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={ROUTES.merchant.navigation.list()}
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
          >
            <ArrowLeft className="h-4 w-4" />
            {t('back')}
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{menu.name}</h1>
            <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={updateMutation.isPending}>
          <Save className="mr-2 h-4 w-4" />
          {updateMutation.isPending ? t('saving') : t('save')}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Menu Settings */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{t('settings.title')}</CardTitle>
            <CardDescription>{t('settings.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('settings.name')}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="handle">{t('settings.handle')}</Label>
              <Input
                id="handle"
                value={formData.handle}
                onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                pattern="[a-z0-9\-]+"
              />
              <p className="text-xs text-muted-foreground">
                {t('settings.handleHelp')}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('settings.description')}</Label>
              <Input
                id="description"
                value={formData.description || ''}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value || null })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Menu Items Tree */}
        <div className="lg:col-span-2 space-y-6">
          {/* Health Widget */}
          <NavigationHealthWidget
            items={menu.items}
            onEditItem={(itemId) => {
              // Future: open edit dialog for specific item
              console.log('Edit item:', itemId);
            }}
            onCreatePage={(url) => {
              // Open CMS to create page
              window.open(`/merchant/cms/pages/create?slug=${encodeURIComponent(url.replace('/', ''))}`, '_blank');
            }}
          />

          {/* Tree */}
          <Card>
            <CardHeader>
              <CardTitle>{t('items.title')}</CardTitle>
              <CardDescription>{t('items.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <MenuItemsTree storeId={storeId} menuId={menuId} items={menu.items} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
