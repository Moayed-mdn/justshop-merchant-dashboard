'use client';

/**
 * Menu Item Dialog Component.
 * Modal for creating or editing a menu item with multilingual support.
 */

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  useCreateMenuItem,
  useUpdateMenuItem,
} from '@/hooks/navigation/useNavigationMenuMutations';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import type {
  NavigationMenuItemView,
  CreateMenuItemPayload,
  UpdateMenuItemPayload,
} from '@/types/navigation';

interface Props {
  storeId: string;
  menuId: string;
  item?: NavigationMenuItemView; // If provided, edit mode
  parentId?: number | null; // For creating child items
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MenuItemDialog({
  storeId,
  menuId,
  item,
  parentId,
  open,
  onOpenChange,
}: Props) {
  const t = useTranslations('theme.navigation.itemDialog');
  const isEditMode = !!item;

  const createMutation = useCreateMenuItem(storeId, menuId);
  const updateMutation = item
    ? useUpdateMenuItem(storeId, menuId, String(item.id))
    : null;

  const [formData, setFormData] = useState<CreateMenuItemPayload | UpdateMenuItemPayload>({
    parent_id: parentId || null,
    label: { en: '', ar: '' },
    url: '',
    target: '_self',
    position: 0,
    is_enabled: true,
  });

  // Initialize form data when item changes
  useEffect(() => {
    if (item) {
      setFormData({
        parent_id: item.parentId,
        label: item.label,
        url: item.url,
        target: item.target,
        position: item.position,
        is_enabled: item.isEnabled,
      });
    } else {
      setFormData({
        parent_id: parentId || null,
        label: { en: '', ar: '' },
        url: '',
        target: '_self',
        position: 0,
        is_enabled: true,
      });
    }
  }, [item, parentId, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditMode && updateMutation) {
      updateMutation.mutate(formData as UpdateMenuItemPayload, {
        onSuccess: () => {
          toast.success(t('updateSuccess'));
          onOpenChange(false);
        },
        onError: (err: any) => {
          logger.error('Failed to update menu item', { error: err });
          toast.error(err?.message ?? t('updateError'));
        },
      });
    } else {
      createMutation.mutate(formData as CreateMenuItemPayload, {
        onSuccess: () => {
          toast.success(t('createSuccess'));
          onOpenChange(false);
        },
        onError: (err: any) => {
          logger.error('Failed to create menu item', { error: err });
          toast.error(err?.message ?? t('createError'));
        },
      });
    }
  };

  const isPending = isEditMode ? updateMutation?.isPending : createMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? t('editTitle') : t('createTitle')}
            </DialogTitle>
            <DialogDescription>
              {isEditMode ? t('editDescription') : t('createDescription')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Multilingual Labels */}
            <div className="space-y-3">
              <Label>{t('form.label')}</Label>
              
              <div className="space-y-2">
                <Label htmlFor="label-en" className="text-sm text-muted-foreground">
                  {t('form.labelEn')}
                </Label>
                <Input
                  id="label-en"
                  value={formData.label.en || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      label: { ...formData.label, en: e.target.value },
                    })
                  }
                  placeholder={t('form.labelEnPlaceholder')}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="label-ar" className="text-sm text-muted-foreground">
                  {t('form.labelAr')}
                </Label>
                <Input
                  id="label-ar"
                  value={formData.label.ar || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      label: { ...formData.label, ar: e.target.value },
                    })
                  }
                  placeholder={t('form.labelArPlaceholder')}
                  dir="rtl"
                  required
                />
              </div>
            </div>

            <Separator />

            {/* URL */}
            <div className="space-y-2">
              <Label htmlFor="url">{t('form.url')}</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder={t('form.urlPlaceholder')}
                required
              />
              <p className="text-xs text-muted-foreground">{t('form.urlHelp')}</p>
            </div>

            {/* Target */}
            <div className="space-y-2">
              <Label htmlFor="target">{t('form.target')}</Label>
              <Select
                value={formData.target}
                onValueChange={(value: '_self' | '_blank') =>
                  setFormData({ ...formData, target: value })
                }
              >
                <SelectTrigger id="target">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_self">{t('form.targetSelf')}</SelectItem>
                  <SelectItem value="_blank">{t('form.targetBlank')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Position */}
            <div className="space-y-2">
              <Label htmlFor="position">{t('form.position')}</Label>
              <Input
                id="position"
                type="number"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: parseInt(e.target.value) || 0 })
                }
                min="0"
              />
              <p className="text-xs text-muted-foreground">{t('form.positionHelp')}</p>
            </div>

            {/* Enabled */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_enabled"
                checked={formData.is_enabled}
                onChange={(e) =>
                  setFormData({ ...formData, is_enabled: e.target.checked })
                }
                className="h-4 w-4"
              />
              <Label htmlFor="is_enabled" className="font-normal">
                {t('form.enabled')}
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              {t('form.cancel')}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? isEditMode
                  ? t('form.updating')
                  : t('form.creating')
                : isEditMode
                ? t('form.update')
                : t('form.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
