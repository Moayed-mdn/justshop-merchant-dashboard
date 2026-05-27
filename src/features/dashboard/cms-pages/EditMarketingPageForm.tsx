'use client';

import { useUpdateMarketingPage } from '@/hooks/marketing-pages/useUpdateMarketingPage';
import MarketingPageForm from './MarketingPageForm';
import type { MarketingPageDetailView } from '@/types/marketing-page';
import type { MarketingPageFormValues } from '@/schemas/marketing-pages';

interface Props {
  storeId: string;
  pageId:  string;
  page:    MarketingPageDetailView;
}

export default function EditMarketingPageForm({ storeId, pageId, page }: Props) {
  const update = useUpdateMarketingPage(storeId, pageId);

  const handleSubmit = async (values: MarketingPageFormValues) => {
    // Normalize published_at: empty string should be null for the backend
    const publishedAt = values.published_at && values.published_at.trim() !== '' 
      ? values.published_at 
      : null;

    await update.mutateAsync({
      title:        values.title,
      slug:         values.slug,
      excerpt:      values.excerpt,
      template:     values.template,
      status:       values.status,
      published_at: publishedAt,
      sort_order:   values.sort_order,
      seo:          values.seo,
      sections:     values.sections.map(s => ({
        ...s,
        // Ensure both 'type' and 'section_type' are present for backend compatibility
        section_type: s.type,
      })),
    });
  };

  return (
    <MarketingPageForm
      storeId={storeId}
      page={page}
      onSubmit={handleSubmit}
      isLoading={update.isPending}
    />
  );
}
