'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { useRouter } from '@/lib/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { checkSlugAvailability, createStore } from '@/lib/api/stores';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { queryKeys } from '@/lib/queryKeys';
import type { ApiError } from '@/types/api';
import { toast } from 'sonner';
import { ROUTES } from '@/config/routes';
import { postAuthChannelMessage } from '@/lib/auth/channel';
import {
  clearCreateStoreDraft,
  loadCreateStoreDraft,
  persistCreateStoreDraft,
} from '@/lib/auth/storage';

function getCurrentTimestamp(): number {
  return Date.now();
}

export function CreateStoreWizard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fetchBootstrap = useBootstrapStore((state) => state.fetchBootstrap);
  const setProvisioning = useBootstrapStore((state) => state.setProvisioning);
  const [formError, setFormError] = useState<string | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(3, 'Store name must be at least 3 characters.'),
        slug: z
          .string()
          .min(3, 'Store slug must be at least 3 characters.')
          .regex(/^[a-z0-9-]+$/, 'Store slug must use lowercase letters, numbers, and hyphens only.'),
      }),
    []
  );

  type CreateStoreForm = z.infer<typeof schema>;

  const {
    register,
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CreateStoreForm>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      slug: '',
    },
  });

  const name = useWatch({ control, name: 'name' }) ?? '';
  const slug = useWatch({ control, name: 'slug' }) ?? '';
  const debouncedSlug = useDebounce(slug, 500);
  const canCheckSlug = debouncedSlug.length >= 3 && /^[a-z0-9-]+$/.test(debouncedSlug);

  const slugAvailabilityQuery = useQuery({
    queryKey: ['store-slug-check', debouncedSlug],
    queryFn: ({ signal }) => checkSlugAvailability(debouncedSlug, { signal }),
    enabled: canCheckSlug,
    retry: false,
    staleTime: 0,
  });

  const isCheckingSlug = slugAvailabilityQuery.isFetching;
  const slugStatus: 'idle' | 'available' | 'taken' | 'error' = !canCheckSlug
    ? 'idle'
    : slugAvailabilityQuery.isError
      ? 'error'
      : slugAvailabilityQuery.data?.data.available
        ? 'available'
        : slugAvailabilityQuery.data
          ? 'taken'
          : 'idle';

  useEffect(() => {
    if (!name || slug.length > 0) {
      return;
    }

    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    setValue('slug', generatedSlug, { shouldValidate: true });
  }, [name, setValue, slug.length]);

  useEffect(() => {
    if (name || slug) {
      return;
    }

    const draft = loadCreateStoreDraft();
    if (!draft || (!draft.name && !draft.slug)) {
      return;
    }

    setValue('name', draft.name, { shouldDirty: false, shouldValidate: true });
    setValue('slug', draft.slug, { shouldDirty: false, shouldValidate: true });
    setDraftRestored(true);
  }, [name, setValue, slug]);

  useEffect(() => {
    persistCreateStoreDraft({ name, slug });
  }, [name, slug]);

  const onSubmit = handleSubmit(async (data) => {
    setFormError(null);
    try {
      const response = await createStore(data);
      clearCreateStoreDraft();
      setProvisioning({
        tracked_store_id: response.data.id,
        status: 'pending',
        progress: 0,
        current_step: 'initializing_store',
        message: response.message,
        retryable: false,
        started_at: getCurrentTimestamp(),
        last_checked_at: null,
        soft_timed_out: false,
        hard_timed_out: false,
      });

      try {
        const bootstrap = await fetchBootstrap();
        queryClient.setQueryData(queryKeys.auth.me(), bootstrap);
        postAuthChannelMessage('bootstrap-refresh');
      } catch {
        queryClient.setQueryData(queryKeys.auth.me(), useBootstrapStore.getState().bootstrap);
      }

      toast.success(response.message || 'Store creation has started.');
      router.push(ROUTES.onboarding.home());
    } catch (error) {
      const apiError = error as ApiError;
      const storeError = apiError.errors.store?.[0];

      if (apiError.errors.name?.[0]) {
        setError('name', { message: apiError.errors.name[0] });
      }

      if (apiError.errors.slug?.[0]) {
        setError('slug', { message: apiError.errors.slug[0] });
      }

      if (storeError) {
        await queryClient.fetchQuery({
          queryKey: queryKeys.auth.me(),
          queryFn: ({ signal }) => fetchBootstrap({ signal }),
        });
        clearCreateStoreDraft();
        setFormError(storeError);
        toast.error(storeError);
        router.push(ROUTES.onboarding.home());
        return;
      }

      if (apiError.status === 403) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
        setFormError(apiError.message || 'Store creation is currently blocked. Refresh the onboarding state to continue.');
        toast.error(apiError.message || 'Store creation is currently blocked.');
        router.push(ROUTES.onboarding.home());
        return;
      }

      setFormError(
        apiError.message ||
          'Failed to create store. If the request may have reached the backend, refresh onboarding before submitting again.'
      );
      toast.error(apiError.message || 'Failed to create store.');
    }
  });

  return (
    <div className="mx-auto max-w-2xl space-y-8 py-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Create your first store</h1>
        <p className="text-muted-foreground">
          Pick a store name and slug. The dashboard will keep you in provisioning until the store is ready.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <form onSubmit={onSubmit} className="space-y-6">
          {formError ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {formError}
            </div>
          ) : null}
          {draftRestored ? (
            <div className="rounded-lg border border-border/70 bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
              Restored your last draft after refresh. Review the details before you continue.
            </div>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="store-name">Store name</Label>
            <Input
              id="store-name"
              placeholder="My First Store"
              data-testid="create-store-name"
              disabled={isSubmitting}
              {...register('name')}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="store-slug">Store slug</Label>
            <div className="relative">
              <Input
                id="store-slug"
                placeholder="my-first-store"
                data-testid="create-store-slug"
                disabled={isSubmitting}
                className="pr-10"
                {...register('slug')}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {isCheckingSlug ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : null}
                {!isCheckingSlug && slugStatus === 'available' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : null}
                {!isCheckingSlug && slugStatus === 'taken' ? <XCircle className="h-4 w-4 text-destructive" /> : null}
              </div>
            </div>
            {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
            {!errors.slug && slugStatus === 'taken' ? (
              <p className="text-sm text-destructive">That slug is already in use.</p>
            ) : null}
            {!errors.slug && slugStatus === 'available' ? (
              <p className="text-sm text-green-600">That slug is available.</p>
            ) : null}
            {slugStatus === 'error' ? (
              <p className="text-sm text-muted-foreground">
                Could not verify slug availability right now. You can keep editing and retry when the network is stable.
              </p>
            ) : null}
          </div>

          <Button
            type="submit"
            className="w-full"
            data-testid="create-store-submit"
            disabled={!isValid || isSubmitting || isCheckingSlug || slugStatus === 'taken'}
          >
            {isSubmitting ? 'Creating store...' : 'Create store'}
          </Button>
          <p className="text-xs text-muted-foreground">
            Do not submit this form again after store creation starts. If something interrupts the flow, refresh to restore the onboarding step from bootstrap.
          </p>
        </form>
      </div>
    </div>
  );
}
