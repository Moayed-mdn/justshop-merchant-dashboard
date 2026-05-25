'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, CheckCircle2, XCircle, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { checkSlugAvailability, createStore } from '@/lib/api/stores';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { queryKeys } from '@/lib/queryKeys';
import type { ApiError } from '@/types/api';
import { toast } from 'sonner';
import { postAuthChannelMessage } from '@/lib/auth/channel';
import {
  clearCreateStoreDraft,
  loadCreateStoreDraft,
  persistCreateStoreDraft,
} from '@/lib/auth/storage';
import { useDebounce } from '@/lib/hooks/useDebounce';

interface Props {
  /** Called after store creation succeeds and provisioning state is set. */
  onSuccess: () => void;
}

const schema = z.object({
  name: z.string().min(3, 'Store name must be at least 3 characters.'),
  slug: z
    .string()
    .min(3, 'Store slug must be at least 3 characters.')
    .regex(/^[a-z0-9-]+$/, 'Slug must use lowercase letters, numbers, and hyphens only.'),
});

type CreateStoreForm = z.infer<typeof schema>;

export function CreateStoreStep({ onSuccess }: Props) {
  const queryClient = useQueryClient();
  const fetchBootstrap = useBootstrapStore((state) => state.fetchBootstrap);
  const setProvisioning = useBootstrapStore((state) => state.setProvisioning);
  const [formError, setFormError] = useState<string | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);

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
    defaultValues: { name: '', slug: '' },
  });

  const name = useWatch({ control, name: 'name' }) ?? '';
  const slug = useWatch({ control, name: 'slug' }) ?? '';
  const debouncedSlug = useDebounce(slug, 500);
  const canCheckSlug = debouncedSlug.length >= 3 && /^[a-z0-9-]+$/.test(debouncedSlug);

  const slugQuery = useQuery({
    queryKey: ['store-slug-check', debouncedSlug],
    queryFn: ({ signal }) => checkSlugAvailability(debouncedSlug, { signal }),
    enabled: canCheckSlug,
    retry: false,
    staleTime: 0,
  });

  const isCheckingSlug = slugQuery.isFetching;
  const slugStatus: 'idle' | 'available' | 'taken' | 'error' = !canCheckSlug
    ? 'idle'
    : slugQuery.isError
      ? 'error'
      : slugQuery.data?.data.available
        ? 'available'
        : slugQuery.data
          ? 'taken'
          : 'idle';

  // Auto-generate slug from name when slug is still empty
  useEffect(() => {
    if (!name || slug.length > 0) return;
    const generated = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setValue('slug', generated, { shouldValidate: true });
  }, [name, setValue, slug.length]);

  // Restore draft on mount (only when both fields are empty)
  useEffect(() => {
    if (name || slug) return;
    const draft = loadCreateStoreDraft();
    if (!draft || (!draft.name && !draft.slug)) return;
    setValue('name', draft.name, { shouldDirty: false, shouldValidate: true });
    setValue('slug', draft.slug, { shouldDirty: false, shouldValidate: true });
    setDraftRestored(true);
  }, [name, setValue, slug]);

  // Persist draft on every change
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
        started_at: Date.now(),
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
      onSuccess();
    } catch (error) {
      const apiError = error as ApiError;

      if (apiError.errors.name?.[0]) {
        setError('name', { message: apiError.errors.name[0] });
      }
      if (apiError.errors.slug?.[0]) {
        setError('slug', { message: apiError.errors.slug[0] });
      }

      const storeError = apiError.errors.store?.[0];
      if (storeError) {
        await queryClient.fetchQuery({
          queryKey: queryKeys.auth.me(),
          queryFn: ({ signal }) => fetchBootstrap({ signal }),
        });
        clearCreateStoreDraft();
        setFormError(storeError);
        toast.error(storeError);
        onSuccess(); // bootstrap will route to provisioning
        return;
      }

      if (apiError.status === 403) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
        setFormError(
          apiError.message || 'Store creation is currently blocked. Refresh the setup state to continue.'
        );
        toast.error(apiError.message || 'Store creation is currently blocked.');
        onSuccess();
        return;
      }

      setFormError(
        apiError.message ||
          'Failed to create store. If the request may have reached the backend, refresh setup before submitting again.'
      );
      toast.error(apiError.message || 'Failed to create store.');
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <div className="mx-auto w-full max-w-lg space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Store className="h-7 w-7 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Create your store</h1>
          <p className="text-muted-foreground">
            Choose a name and a unique slug for your store. You can update these later.
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <form onSubmit={onSubmit} className="space-y-5">
            {formError ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {formError}
              </div>
            ) : null}

            {draftRestored ? (
              <div className="rounded-lg border border-border/70 bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                Restored your last draft. Review the details before continuing.
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="store-name">Store name</Label>
              <Input
                id="store-name"
                placeholder="Acme Store"
                data-testid="create-store-name"
                disabled={isSubmitting}
                {...register('name')}
              />
              {errors.name ? (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="store-slug">Store slug</Label>
              <div className="relative">
                <Input
                  id="store-slug"
                  placeholder="acme-store"
                  data-testid="create-store-slug"
                  disabled={isSubmitting}
                  className="pr-10"
                  {...register('slug')}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {isCheckingSlug ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : null}
                  {!isCheckingSlug && slugStatus === 'available' ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : null}
                  {!isCheckingSlug && slugStatus === 'taken' ? (
                    <XCircle className="h-4 w-4 text-destructive" />
                  ) : null}
                </div>
              </div>
              {errors.slug ? (
                <p className="text-sm text-destructive">{errors.slug.message}</p>
              ) : null}
              {!errors.slug && slugStatus === 'taken' ? (
                <p className="text-sm text-destructive">That slug is already in use.</p>
              ) : null}
              {!errors.slug && slugStatus === 'available' ? (
                <p className="text-sm text-green-600">That slug is available.</p>
              ) : null}
              {slugStatus === 'error' ? (
                <p className="text-sm text-muted-foreground">
                  Could not verify slug availability. You can keep editing and retry.
                </p>
              ) : null}
              <p className="text-xs text-muted-foreground">
                Used in your store URL. Lowercase letters, numbers, and hyphens only.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              data-testid="create-store-submit"
              disabled={!isValid || isSubmitting || isCheckingSlug || slugStatus === 'taken'}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating store...
                </>
              ) : (
                'Create store'
              )}
            </Button>

            <p className="text-xs text-muted-foreground">
              Do not submit again after creation starts. If something interrupts the flow, refresh to restore your setup state.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
