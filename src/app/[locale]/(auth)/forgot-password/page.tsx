import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ForgotPasswordCard } from '@/features/auth/components/ForgotPasswordCard';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('forgotPassword');
  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  };
}

export default async function ForgotPasswordPage() {
  return <ForgotPasswordCard />;
}
