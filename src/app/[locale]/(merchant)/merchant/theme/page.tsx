/**
 * Theme overview page.
 * Server component that wraps the client-side themes content.
 */

import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ThemesContent } from '@/features/theme/ThemesContent';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'common' });

  return {
    title: t('theme.overview.title'),
  };
}

export default function ThemesPage() {
  return <ThemesContent />;
}
