'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useTranslations } from 'next-intl';
import { useState, useMemo, useTransition } from 'react';
import { toast } from 'sonner';
import { resetPassword } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ApiError } from '@/types/api';
import { useRouter } from '@/lib/navigation';
import { Eye, EyeOff } from 'lucide-react';

interface Props {
  token: string;
  email: string;
}

export function ResetPasswordForm({ token, email }: Props) {
  const t = useTranslations('resetPassword');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const Schema = useMemo(() => z.object({
    password: z.string().min(8, { message: t('errors.passwordTooShort') }),
    password_confirmation: z.string(),
  }).refine((data) => data.password === data.password_confirmation, {
    message: t('errors.passwordsDoNotMatch'),
    path: ['password_confirmation'],
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
        await resetPassword({
          token,
          email,
          password: data.password,
          password_confirmation: data.password_confirmation,
        });
        toast.success(t('success.passwordReset'));
        router.push('/login');
      } catch (error) {
        const apiError = error as ApiError;
        if (apiError.errors) {
          Object.entries(apiError.errors).forEach(([field, messages]) => {
            setError(field as any, { message: messages[0] });
          });
        }
        toast.error(apiError.message || t('errors.genericError'));
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">{t('passwordLabel')}</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder={t('passwordPlaceholder')}
            disabled={isPending || isSubmitting}
            {...register('password')}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute inset-e-0 px-3 top-0 h-full hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isPending || isSubmitting}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password_confirmation">{t('passwordConfirmationLabel')}</Label>
        <Input
          id="password_confirmation"
          type="password"
          placeholder={t('passwordConfirmationPlaceholder')}
          disabled={isPending || isSubmitting}
          {...register('password_confirmation')}
        />
        {errors.password_confirmation && (
          <p className="text-sm text-destructive">{errors.password_confirmation.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isPending || isSubmitting}
      >
        {isPending ? t('resetting') : t('submitButton')}
      </Button>
    </form>
  );
}
