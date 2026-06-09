'use client';

import { useState } from 'react';
import type { Store } from '@/types/store';
import type { ApiError } from '@/types/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useUpdateStore } from './useUpdateStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const schema = z.object({
  name: z.string().min(3, 'Store name must be at least 3 characters.'),
});

type StoreSettingsFormData = z.infer<typeof schema>;

interface StoreSettingsFormProps {
  store: Store;
}

/**
 * Store Settings Form.
 * Allows editing basic store metadata like name.
 */
export function StoreSettingsForm({ store }: StoreSettingsFormProps) {
  const [showSaved, setShowSaved] = useState(false);
  const updateStoreMutation = useUpdateStore(String(store.id));

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<StoreSettingsFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: store.name,
    },
    mode: 'onChange',
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await updateStoreMutation.mutateAsync(data);
      reset({ name: data.name });
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.errors?.name?.[0]) {
        setError('name', { message: apiError.errors.name[0] });
      }
    }
  });

  const isPending = updateStoreMutation.isPending;

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Store Settings</CardTitle>
        <CardDescription>
          Manage your store&rsquo;s name and view your store slug.
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="store-name">Store Name</Label>
            <Input
              id="store-name"
              {...register('name')}
              placeholder="e.g. Acme Corp"
              disabled={isPending}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              This is shown to customers and appears in the store switcher.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="store-slug">Store Slug</Label>
            <Input
              id="store-slug"
              value={store.slug}
              disabled
              className="bg-muted opacity-70"
            />
            <p className="text-xs text-muted-foreground">
              The slug is used in your store&rsquo;s URL. Changing it would affect existing links and SEO, so it cannot be modified from this form.
            </p>
            <details className="group">
              <summary className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground">
                Need to change your slug?
              </summary>
              <p className="mt-2 text-xs text-muted-foreground">
                Contact our support team with your preferred slug and we&rsquo;ll help you through the process. Note that changing a slug will update your store URL and may affect indexed search results.
              </p>
            </details>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/20 px-6 py-4">
          <div className="flex w-full items-center justify-between">
            <div>
              {showSaved ? (
                <span className="flex items-center gap-1.5 text-sm text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Saved
                </span>
              ) : null}
            </div>
            <Button 
              type="submit" 
              disabled={!isValid || !isDirty || isPending}
              className={cn(showSaved && 'bg-green-600 hover:bg-green-700')}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save changes'
              )}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
