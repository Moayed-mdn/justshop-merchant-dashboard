'use client';

/**
 * Login form component with bootstrap-first auth recovery.
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/lib/navigation';
import { useSearchParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

import { useBootstrapStore } from '@/stores/bootstrapStore';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ApiError } from '@/types/api';
import { logger } from '@/lib/logger';
import { isSafeRedirectPath, stripLocale } from '@/lib/auth/redirects';
import { postAuthChannelMessage } from '@/lib/auth/channel';
import { resolvePostBootstrapPath } from '@/lib/auth/bootstrap-routing';

export function LoginForm() {
  const t = useTranslations('login');
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const login = useBootstrapStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const sessionExpired = searchParams.get('expired') === '1';

  // Build schema with translated error messages - memoized to prevent recreation
  const LoginSchema = useMemo(() => z.object({
    email: z.string().email({ message: t('errors.invalidEmail') }),
    password: z.string().min(8, { message: t('errors.passwordTooShort') }),
  }), [t]);

  type LoginFormData = z.infer<typeof LoginSchema>;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    logger.debug('Submitting login form');
    setFormError(null);
    setIsRequestPending(true);

    try {
      const bootstrap = await login({ email: data.email, password: data.password });
      queryClient.setQueryData(queryKeys.merchant.me(), bootstrap);
      postAuthChannelMessage('login');

      toast.success(t('success.loggedIn'));

      const redirectParam = searchParams.get('redirect');
      let destination = bootstrap ? resolvePostBootstrapPath(bootstrap) : '/';
      if (redirectParam && isSafeRedirectPath(redirectParam)) {
        destination = stripLocale(redirectParam);
      }

      router.push(destination);
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.errors?.email?.[0]) {
        setError('email', { message: apiError.errors.email[0] });
      }
      if (apiError.errors?.password?.[0]) {
        setError('password', { message: apiError.errors.password[0] });
      }

      if (apiError.code === 'AUTH_001') {
        setFormError(apiError.message || 'The email or password is incorrect.');
      } else if (apiError.code === 'AUTH_008') {
        setFormError(apiError.message || 'Too many attempts. Please wait before trying again.');
      } else if (apiError.status === 403) {
        setFormError(apiError.message || 'This account cannot access the dashboard right now.');
      } else if (Object.keys(apiError.errors ?? {}).length === 0) {
        setFormError(apiError.message || 'Unable to sign in right now. Please try again.');
      }

      toast.error(apiError.message || t('errors.genericError'));
    } finally {
      setIsRequestPending(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="w-full space-y-4">
      {sessionExpired ? (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-900 dark:text-amber-200">
          Your session expired. Sign in again to restore your dashboard.
        </div>
      ) : null}
      {formError ? (
        <div
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          data-testid="login-form-error"
          aria-live="polite"
        >
          {formError}
        </div>
      ) : null}
      {/* Email field */}
      <div className="space-y-2">
        <Label htmlFor="email">{t('emailLabel')}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder={t('emailPlaceholder')}
          data-testid="login-email"
          disabled={isRequestPending || isSubmitting}
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Password field */}
      <div className="space-y-2">
        <Label htmlFor="password">{t('passwordLabel')}</Label>
        <div className="relative">
          <Input
            id="password"            
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder={t('passwordPlaceholder')}
            data-testid="login-password"
            disabled={isRequestPending || isSubmitting}
            {...register('password')}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute inset-e-0 px-3 top-0 h-full  hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={t('togglePassword')}
            disabled={isRequestPending || isSubmitting}
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

      {/* Submit button */}
      <Button
        type="submit"
        className="w-full"
        data-testid="login-submit"
        disabled={isRequestPending || isSubmitting}
      >
        {isRequestPending ? t('signingIn') : t('submitButton')}
      </Button>
    </form>
  );
}
