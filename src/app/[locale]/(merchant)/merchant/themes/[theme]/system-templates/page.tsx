import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { SystemTemplatesContent } from '@/features/system-templates/SystemTemplatesContent';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });

  return {
    title: 'System Templates',
  };
}

export default function SystemTemplatesPage() {
  return <SystemTemplatesContent />;
}
