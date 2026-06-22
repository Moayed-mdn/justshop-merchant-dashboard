'use client';

/**
 * Create Navigation Menu Dialog.
 * Modal dialog for creating a new navigation menu.
 */

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/lib/navigation';
import { ROUTES } from '@/config/routes';
import { useCreateNavigationMenu } from '@/hooks/navigation/useNavigationMenuMutations';
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
import type { CreateNavigationMenuPayload } from '@/types/navigation';

interface Props {
  storeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateNavigationMenuDialog({
  storeId,
  open,
  onOpenChange,
}: Props) {
  const t = useTranslations('theme.navigation.createDialog');
  const router = useRouter();
  const createMutation = useCreateNavigationMenu(storeId);

  const [formData, setFormData] = useState<CreateNavigationMenuPayload>({
    name: '',
    handle: '',
    description: null,
  });

  const handleNameChange = (name: string) => {
    const handle = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    setFormData({ ...formData, name, handle });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createMutation.mutate(formData, {
      onSuccess: (data: any) => {
        toast.success(t('success'));
        onOpenChange(false);
        setFormData({ name: '', handle: '', description: null });
        
        // Navigate to editor
        router.push(ROUTES.merchant.navigation.edit(String(data.id)));
      },
      onError: (err: any) => {
        logger.error('Failed to create navigation menu', { error: err });
        toast.error(err?.message ?? t('error'));
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t('title')}</DialogTitle>
            <DialogDescription>{t('description')}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('form.name')}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder={t('form.namePlaceholder')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="handle">{t('form.handle')}</Label>
              <Input
                id="handle"
                value={formData.handle}
                onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                placeholder={t('form.handlePlaceholder')}
                required
                pattern="[a-z0-9-]+"
              />
              <p className="text-xs text-muted-foreground">
                {t('form.handleHelp')}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('form.description')}</Label>
              <Input
                id="description"
                value={formData.description || ''}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value || null })
                }
                placeholder={t('form.descriptionPlaceholder')}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending}
            >
              {t('form.cancel')}
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? t('form.creating') : t('form.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
