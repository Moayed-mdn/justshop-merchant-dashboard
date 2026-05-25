'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from '@/lib/navigation';

export default function VerifyEmailRootPage() {
  const t = useTranslations('verifyEmail');
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
          <XCircle className="h-12 w-12 text-destructive" />
          <p className="text-lg font-medium">{t('error')}</p>
          <p className="text-sm text-muted-foreground">{t('errors.invalidLink')}</p>
          <Button onClick={() => router.push('/login')} className="mt-4">
            {t('backToLogin')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
