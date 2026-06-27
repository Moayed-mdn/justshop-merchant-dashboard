'use client';

import { useParams } from 'next/navigation';
import { useStorefrontPage } from '@/hooks/runtime';
import { TemplateRenderer } from './TemplateRenderer';
import { Loader2, AlertCircle } from 'lucide-react';

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
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-destructive font-medium">Page not found</p>
      </div>
    );
  }

  return <TemplateRenderer sections={page.sections} />;
}
