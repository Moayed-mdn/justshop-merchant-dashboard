'use client';

import { useCreateMarketingPage } from '@/hooks/marketing-pages/useCreateMarketingPage';
import MarketingPageForm from './MarketingPageForm';
import type { MarketingPageFormValues } from '@/schemas/marketing-pages';

interface Props {
  storeId: string;
}

export default function CreateMarketingPageForm({ storeId }: Props) {
  const create = useCreateMarketingPage(storeId);

  const handleSubmit = async (values: MarketingPageFormValues) => {
    await create.mutateAsync({
      title:        values.title,
      slug:         values.slug,
      excerpt:      values.excerpt,
      template:     values.template,
      status:       values.status,
      published_at: values.published_at,
      sort_order:   values.sort_order,
      seo:          values.seo,
      sections:     values.sections,
    });
  };

  return (
    <MarketingPageForm
      storeId={storeId}
      onSubmit={handleSubmit}
      isLoading={create.isPending}
    />
  );
}
