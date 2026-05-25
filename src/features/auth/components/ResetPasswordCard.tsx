'use client';

import { useTranslations } from 'next-intl';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ResetPasswordForm } from './ResetPasswordForm';

interface Props {
  token: string;
  email: string;
}

export function ResetPasswordCard({ token, email }: Props) {
  const t = useTranslations('resetPassword');

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="text-center mb-2">
            <h1 className="text-2xl font-semibold">{t('appName')}</h1>
          </div>
          <CardTitle className="text-xl text-center">{t('title')}</CardTitle>
          <CardDescription className="text-center">
            {t('subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm token={token} email={email} />
        </CardContent>
      </Card>
    </div>
  );
}
