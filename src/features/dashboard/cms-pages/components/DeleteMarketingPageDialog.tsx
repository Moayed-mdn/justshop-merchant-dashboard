'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useDeleteMarketingPage } from '@/hooks/marketing-pages/useDeleteMarketingPage';

interface Props {
  storeId:   string;
  pageId:    string;
  pageTitle: string;
}

export function DeleteMarketingPageDialog({ storeId, pageId, pageTitle }: Props) {
  const t      = useTranslations('cmsPages');
  const remove = useDeleteMarketingPage(storeId, pageId);
  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    await remove.mutateAsync();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="destructive" size="sm" disabled={remove.isPending}>
            <Trash2 className="h-4 w-4 mr-1" />
            {t('form.delete')}
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('form.deleteTitle')}</DialogTitle>
          <DialogDescription>
            {t('form.deleteConfirm', { title: pageTitle })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t('form.cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={remove.isPending}
          >
            {remove.isPending ? t('form.deleting') : t('form.delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
