'use client';

import { useTranslations } from 'next-intl';
import { useTagDetail } from '@/hooks/tags/useTagDetail';
import { EditTagSkeleton } from './EditTagSkeleton';
import EditTagForm from './EditTagForm';
import { DeleteTagButton } from './DeleteTagButton';

interface Props { storeSlug: string; tagId: string }

export default function EditTagContent({ storeSlug, tagId }: Props) {
  const t = useTranslations('tags');
  const { data: tag, isLoading, error } = useTagDetail(storeSlug, tagId);

  if (isLoading) return <EditTagSkeleton />;

  if (error || !tag) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">{t('detail.error')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EditTagForm storeSlug={storeSlug} tagId={tagId} tag={tag} />

      <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-6">
        <h3 className="font-semibold text-destructive mb-1">{t('form.dangerZone')}</h3>
        <p className="text-sm text-muted-foreground mb-4">{t('form.deleteDescription')}</p>
        <DeleteTagButton storeSlug={storeSlug} tagId={tagId} />
      </div>
    </div>
  );
}
