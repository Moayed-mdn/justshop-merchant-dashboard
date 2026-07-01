'use client';

import { useCreateMarketingPage } from '@/hooks/marketing-pages/useCreateMarketingPage';
import MarketingPageForm from './MarketingPageForm';
import type { MarketingPageFormValues } from '@/schemas/marketing-pages';

interface Props {
  storeSlug: string;
}

export default function CreateMarketingPageForm({ storeSlug }: Props) {
  const create = useCreateMarketingPage(storeSlug);

  const handleSubmit = async (values: MarketingPageFormValues) => {
    // Normalize published_at: empty string should be null for the backend
    const publishedAt = values.published_at && values.published_at.trim() !== '' 
      ? values.published_at 
      : null;

    await create.mutateAsync({
      title:           values.title,
      slug:            values.slug,
      excerpt:         values.excerpt,
      template:        values.template,
      page_template_id: values.page_template_id,
      status:          values.status,
      published_at:    publishedAt,
      sort_order:      values.sort_order,
      is_homepage:     values.is_homepage,
      seo:             values.seo,
      sections:        values.sections,
    });
  };

  return (
    <MarketingPageForm
      storeSlug={storeSlug}
      onSubmit={handleSubmit}
      isLoading={create.isPending}
    />
  );
}
