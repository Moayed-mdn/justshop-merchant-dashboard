/**
 * Assets library page.
 * Server component that wraps the client-side assets content.
 */

import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AssetsContent } from '@/features/theme/assets/AssetsContent';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });

  return {
    title: t('assets'),
  };
}

export default function AssetsPage() {
  return <AssetsContent />;
}
