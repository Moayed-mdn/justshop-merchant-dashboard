'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { usePageTemplates } from '@/hooks/page-templates/usePageTemplates';
import {
  useDeletePageTemplate,
} from '@/hooks/page-templates/usePageTemplateMutations';
import { PageTemplatesTable } from './PageTemplatesTable';
import { CreatePageTemplateDialog } from './CreatePageTemplateDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { PageTemplateView } from '@/types/theme';
import { getStoreRouteParam } from '@/lib/stores/route-param';

export function PageTemplatesContent() {
  const t = useTranslations();
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);

  const activeStoreSlug = activeStore ? getStoreRouteParam(activeStore) : null;

  const { data: templates, isLoading, error } = usePageTemplates(activeStoreSlug!);
  const deleteMutation = useDeletePageTemplate(activeStoreSlug!);

  const handleDelete = async (templateId: string) => {
    try {
      await deleteMutation.mutateAsync(templateId);
      toast.success(t('theme.templates.deleteSuccess'));
    } catch (err) {
      toast.error(t('theme.templates.deleteError'));
    } finally {
      setShowDeleteDialog(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('theme.templates.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('theme.templates.subtitle')}
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('theme.templates.createTemplate')}
        </Button>
      </div>

      {showCreateDialog && (
        <CreatePageTemplateDialog onClose={() => setShowCreateDialog(false)} />
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t('theme.templates.title')}</CardTitle>
          <CardDescription>
            {t('theme.templates.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PageTemplatesTable
            templates={templates ?? []}
            isLoading={isLoading}
            error={error?.message ?? null}
            onDelete={(id) => setShowDeleteDialog(id)}
            deletingId={showDeleteDialog}
            onConfirmDelete={handleDelete}
            onCloseDelete={() => setShowDeleteDialog(null)}
            isDeleting={deleteMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
