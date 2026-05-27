'use client';

import { Store } from '@/types/store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useUpdateStore } from './useUpdateStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

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
  const updateStoreMutation = useUpdateStore(String(store.id));

  const {
    register,
    handleSubmit,
    setError,
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
    } catch (error: any) {
      if (error.errors?.name) {
        setError('name', { message: error.errors.name[0] });
      }
    }
  });

  const isPending = updateStoreMutation.isPending;

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Store Settings</CardTitle>
        <CardDescription>
          Update your store's basic information.
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
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
              Slug editing is currently disabled. Contact support to change your store slug.
            </p>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/20 px-6 py-4">
          <Button 
            type="submit" 
            disabled={!isValid || !isDirty || isPending}
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
        </CardFooter>
      </form>
    </Card>
  );
}
