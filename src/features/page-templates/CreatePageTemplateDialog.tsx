'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { useCreatePageTemplate } from '@/hooks/page-templates/usePageTemplateMutations';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface CreatePageTemplateDialogProps {
  onClose: () => void;
}

export function CreatePageTemplateDialog({ onClose }: CreatePageTemplateDialogProps) {
  const t = useTranslations();
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const [name, setName] = useState('');

  const activeStoreId = activeStore ? String(activeStore.id) : null;

  const createMutation = useCreatePageTemplate(activeStoreId!);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error(t('theme.templates.nameRequired'));
      return;
    }

    try {
      await createMutation.mutateAsync({
        name: name.trim(),
        handle: name.trim().toLowerCase().replace(/\s+/g, '-'),
        type: 'page',
        sections: {},
        section_order: [],
      });

      toast.success(t('theme.templates.createSuccess'));
      onClose();
    } catch (error) {
      toast.error(t('theme.templates.createError'));
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('theme.templates.createTemplate')}</DialogTitle>
          <DialogDescription>
            {t('theme.templates.createDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="template-name">{t('theme.templates.name')}</Label>
            <Input
              id="template-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('theme.templates.namePlaceholder')}
              autoFocus
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!name.trim() || createMutation.isPending}
          >
            {createMutation.isPending ? t('theme.templates.creating') : t('theme.templates.createTemplate')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
