'use client';

import { useParams, notFound } from 'next/navigation';
import { useStorefrontPage } from '@/hooks/runtime';
import { TemplateRenderer } from './TemplateRenderer';
import { Loader2 } from 'lucide-react';

export function StorefrontPage() {
  const params = useParams();
  const slug = params?.slug as string[] | undefined;
  const path = slug ? `/${slug.join('/')}` : '/';

  const { data: page, isLoading, isError } = useStorefrontPage(path);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !page) {
    notFound();
  }

  return <TemplateRenderer sections={page.sections} />;
}
