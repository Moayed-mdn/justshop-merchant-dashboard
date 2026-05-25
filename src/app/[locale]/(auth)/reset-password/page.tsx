import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ResetPasswordCard } from '@/features/auth/components/ResetPasswordCard';
import { notFound } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('resetPassword');
  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  };
}

interface PageProps {
  searchParams: Promise<{ token?: string; email?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const { token, email } = await searchParams;

  if (!token || !email) {
    notFound();
  }

  return <ResetPasswordCard token={token} email={email} />;
}
