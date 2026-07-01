'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { useDuplicatePageTemplate } from '@/hooks/page-templates/usePageTemplateMutations';
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
import type { PageTemplateView } from '@/types/theme';
import { getStoreRouteParam } from '@/lib/stores/route-param';

interface DuplicatePageTemplateDialogProps {
  template: PageTemplateView;
  onClose: () => void;
}

export function DuplicatePageTemplateDialog({ template, onClose }: DuplicatePageTemplateDialogProps) {
  const t = useTranslations();
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const [name, setName] = useState(`${template.name} (Copy)`);

  const activeStoreSlug = activeStore ? getStoreRouteParam(activeStore) : null;

  const duplicateMutation = useDuplicatePageTemplate(activeStoreSlug!);

  const handleDuplicate = async () => {
    if (!name.trim()) return;

    try {
      await duplicateMutation.mutateAsync({
        templateId: template.id.toString(),
        payload: { name: name.trim() },
      });

      toast.success(t('theme.templates.duplicateSuccess'));
      onClose();
    } catch (error) {
      toast.error(t('theme.templates.duplicateError'));
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('theme.templates.duplicateTemplate')}</DialogTitle>
          <DialogDescription>
            {t('theme.templates.duplicateDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="duplicate-name">{t('theme.templates.name')}</Label>
            <Input
              id="duplicate-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button
            onClick={handleDuplicate}
            disabled={!name.trim() || duplicateMutation.isPending}
          >
            {duplicateMutation.isPending ? t('theme.duplicating') : t('theme.duplicate')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
