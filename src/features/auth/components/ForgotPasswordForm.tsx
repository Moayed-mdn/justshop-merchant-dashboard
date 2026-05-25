'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useTranslations } from 'next-intl';
import { useState, useMemo, useTransition } from 'react';
import { toast } from 'sonner';
import { forgotPassword } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ApiError } from '@/types/api';
import { Link } from '@/lib/navigation';

export function ForgotPasswordForm() {
  const t = useTranslations('forgotPassword');
  const [isPending, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const Schema = useMemo(() => z.object({
    email: z.string().email({ message: t('errors.invalidEmail') }),
  }), [t]);

  type FormData = z.infer<typeof Schema>;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(Schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    startTransition(async () => {
      try {
        await forgotPassword(data);
        setIsSubmitted(true);
        toast.success(t('success.emailSent'));
      } catch (error) {
        const apiError = error as ApiError;
        if (apiError.errors?.email?.[0]) {
          setError('email', { message: apiError.errors.email[0] });
        }
        toast.error(apiError.message || t('errors.genericError'));
      }
    });
  });

  if (isSubmitted) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-muted-foreground">{t('successMessage')}</p>
        <Link href="/login" className="inline-flex h-8 w-full items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium hover:bg-muted hover:text-foreground">
          {t('backToLogin')}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{t('emailLabel')}</Label>
        <Input
          id="email"
          type="email"
          placeholder={t('emailPlaceholder')}
          disabled={isPending || isSubmitting}
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isPending || isSubmitting}
      >
        {isPending ? t('sending') : t('submitButton')}
      </Button>

      <div className="text-center">
        <Link href="/login" className="text-sm text-primary hover:underline">
          {t('backToLogin')}
        </Link>
      </div>
    </form>
  );
}
