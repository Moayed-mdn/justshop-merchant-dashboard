'use client';

/**
 * Edit Hero Banner Form Component
 * Handles updating existing promotional banners with translations
 */

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from '@/lib/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { updateHeroBanner } from '@/lib/api/hero-banners';
import type { HeroBanner, UpdateHeroBannerData, HeroVisualType, HeroLinkTarget } from '@/lib/api/hero-banners';
import { ROUTES } from '@/config/routes';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GenericImageUploader } from '@/components/media/GenericImageUploader';

interface Props {
  storeId: string;
  bannerId: string;
  banner: HeroBanner;
}

interface FormValues {
  cat_url: string;
  position: number;
  visual_type: HeroVisualType;
  image_path: string;
  gradient_from: string;
  gradient_to: string;
  link_url: string;
  link_text: string;
  link_target: HeroLinkTarget;
  is_active: boolean;
  starts_at: string;
  ends_at: string;
  // English translation
  title_en: string;
  subtitle_en: string;
  cta_text_en: string;
  // Arabic translation
  title_ar: string;
  subtitle_ar: string;
  cta_text_ar: string;
}

export default function EditHeroBannerForm({ storeId, bannerId, banner }: Props) {
  const t = useTranslations('heroBanners');
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeLocale, setActiveLocale] = useState<'en' | 'ar'>('en');

  // Extract translations from banner data
  const enTranslation = banner.translations.find((t) => t.locale === 'en');
  const arTranslation = banner.translations.find((t) => t.locale === 'ar');

  // Format dates for datetime-local input
  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      cat_url: banner.cat_url || '/shop',
      position: banner.position || 0,
      visual_type: banner.visual_type || 'image',
      image_path: banner.image_path || '',
      gradient_from: banner.gradient_from || '#000000',
      gradient_to: banner.gradient_to || '#ffffff',
      link_url: banner.link_url || '',
      link_text: banner.link_text || '',
      link_target: banner.link_target || '_self',
      is_active: banner.is_active ?? true,
      starts_at: formatDateForInput(banner.starts_at),
      ends_at: formatDateForInput(banner.ends_at),
      title_en: enTranslation?.title || '',
      subtitle_en: enTranslation?.subtitle || '',
      cta_text_en: enTranslation?.cta_text || 'Shop Now',
      title_ar: arTranslation?.title || '',
      subtitle_ar: arTranslation?.subtitle || '',
      cta_text_ar: arTranslation?.cta_text || 'تسوق الآن',
    },
  });

  const visualType = watch('visual_type');
  const isActive = watch('is_active');
  const linkTarget = watch('link_target');
  const imagePath = watch('image_path');

  // Reset form when banner changes
  useEffect(() => {
    const enTrans = banner.translations.find((t) => t.locale === 'en');
    const arTrans = banner.translations.find((t) => t.locale === 'ar');

    reset({
      cat_url: banner.cat_url || '/shop',
      position: banner.position || 0,
      visual_type: banner.visual_type || 'image',
      image_path: banner.image_path || '',
      gradient_from: banner.gradient_from || '#000000',
      gradient_to: banner.gradient_to || '#ffffff',
      link_url: banner.link_url || '',
      link_text: banner.link_text || '',
      link_target: banner.link_target || '_self',
      is_active: banner.is_active ?? true,
      starts_at: formatDateForInput(banner.starts_at),
      ends_at: formatDateForInput(banner.ends_at),
      title_en: enTrans?.title || '',
      subtitle_en: enTrans?.subtitle || '',
      cta_text_en: enTrans?.cta_text || 'Shop Now',
      title_ar: arTrans?.title || '',
      subtitle_ar: arTrans?.subtitle || '',
      cta_text_ar: arTrans?.cta_text || 'تسوق الآن',
    });
  }, [banner, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: UpdateHeroBannerData) => updateHeroBanner(storeId, bannerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-banners', storeId] });
      queryClient.invalidateQueries({ queryKey: ['hero-banner', storeId, bannerId] });
      toast.success('Hero banner updated successfully');
      router.push(ROUTES.merchant.heroBanners.list());
    },
    onError: (error: any) => {
      logger.error('Failed to update hero banner', { error });
      toast.error(error?.message || 'Failed to update hero banner');
    },
  });

  const onSubmit = async (values: FormValues) => {
    const data: UpdateHeroBannerData = {
      cat_url: values.cat_url,
      position: values.position,
      visual_type: values.visual_type,
      is_active: values.is_active,
      link_target: values.link_target || '_self',
      translations: [
        {
          locale: 'en',
          title: values.title_en,
          subtitle: values.subtitle_en || undefined,
          cta_text: values.cta_text_en,
        },
        {
          locale: 'ar',
          title: values.title_ar,
          subtitle: values.subtitle_ar || undefined,
          cta_text: values.cta_text_ar,
        },
      ],
    };

    // Add visual-type specific fields
    if (values.visual_type === 'image') {
      data.image_path = values.image_path;
    } else if (values.visual_type === 'gradient') {
      data.gradient_from = values.gradient_from;
      data.gradient_to = values.gradient_to;
    }

    // Add optional link fields
    if (values.link_url) {
      data.link_url = values.link_url;
    }
    if (values.link_text) {
      data.link_text = values.link_text;
    }

    // Add optional date fields
    if (values.starts_at) {
      data.starts_at = values.starts_at;
    }
    if (values.ends_at) {
      data.ends_at = values.ends_at;
    }

    await updateMutation.mutateAsync(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Edit Hero Banner</h1>
            {banner.deleted_at && (
              <Badge variant="destructive">Deleted</Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            ID: {banner.id} • Position: {banner.position}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !isDirty}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Translations Card */}
          <Card>
            <CardHeader>
              <CardTitle>Content & Translations</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeLocale} onValueChange={(v) => setActiveLocale(v as 'en' | 'ar')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="ar">Arabic (العربية)</TabsTrigger>
                </TabsList>

                {/* English Tab */}
                <TabsContent value="en" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title_en">
                      Title (EN) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title_en"
                      {...register('title_en', { required: 'English title is required' })}
                      placeholder="Your private world of luxury shopping"
                    />
                    {errors.title_en && (
                      <p className="text-sm text-destructive">{errors.title_en.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subtitle_en">Subtitle (EN)</Label>
                    <Textarea
                      id="subtitle_en"
                      {...register('subtitle_en')}
                      placeholder="Enjoy moments of calm while choosing your favorite pieces"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cta_text_en">
                      Call-to-Action Text (EN) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="cta_text_en"
                      {...register('cta_text_en', { required: 'CTA text is required' })}
                      placeholder="Shop Now"
                    />
                    {errors.cta_text_en && (
                      <p className="text-sm text-destructive">{errors.cta_text_en.message}</p>
                    )}
                  </div>
                </TabsContent>

                {/* Arabic Tab */}
                <TabsContent value="ar" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title_ar">
                      Title (AR) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title_ar"
                      {...register('title_ar', { required: 'Arabic title is required' })}
                      placeholder="عالمك الخاص من التسوق الفاخر"
                      dir="rtl"
                    />
                    {errors.title_ar && (
                      <p className="text-sm text-destructive">{errors.title_ar.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subtitle_ar">Subtitle (AR)</Label>
                    <Textarea
                      id="subtitle_ar"
                      {...register('subtitle_ar')}
                      placeholder="استمتع بلحظات من الهدوء أثناء اختيار قطعك المفضلة"
                      rows={3}
                      dir="rtl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cta_text_ar">
                      Call-to-Action Text (AR) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="cta_text_ar"
                      {...register('cta_text_ar', { required: 'CTA text is required' })}
                      placeholder="تسوق الآن"
                      dir="rtl"
                    />
                    {errors.cta_text_ar && (
                      <p className="text-sm text-destructive">{errors.cta_text_ar.message}</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Link Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle>Link Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="link_url">Link URL</Label>
                <Input
                  id="link_url"
                  {...register('link_url')}
                  placeholder="/shop or https://example.com"
                />
                <p className="text-xs text-muted-foreground">
                  Optional destination URL when banner is clicked
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="link_text">Link Text</Label>
                <Input
                  id="link_text"
                  {...register('link_text')}
                  placeholder="Learn More"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link_target">Link Target</Label>
                <Select
                  value={linkTarget}
                  onValueChange={(value: HeroLinkTarget) => 
                    setValue('link_target', value, { shouldDirty: true })
                  }
                >
                  <SelectTrigger id="link_target">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_self">Same Window (_self)</SelectItem>
                    <SelectItem value="_blank">New Window (_blank)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {banner.image_url && banner.visual_type === 'image' && (
                <div className="space-y-2">
                  <Label>Current Image</Label>
                  <div className="relative aspect-video rounded-md border bg-muted overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={banner.image_url}
                      alt={enTranslation?.title || 'Banner'}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Settings Sidebar - Right Side */}
        <div className="space-y-6">
          {/* Visual Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Visual Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="visual_type">
                  Visual Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={visualType}
                  onValueChange={(value: HeroVisualType) => 
                    setValue('visual_type', value, { shouldDirty: true })
                  }
                >
                  <SelectTrigger id="visual_type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="gradient">Gradient</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {visualType === 'image' && (
                <div className="space-y-2">
                  <GenericImageUploader
                    value={imagePath ?? ''}
                    onChange={(path) => setValue('image_path', path || '', { shouldDirty: true })}
                    context="hero"
                    storeId={storeId}
                    label="Hero Banner Image"
                  />
                  {errors.image_path && (
                    <p className="text-sm text-destructive">{errors.image_path.message}</p>
                  )}
                </div>
              )}

              {visualType === 'gradient' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="gradient_from">
                      Gradient From <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="gradient_from"
                      type="color"
                      {...register('gradient_from')}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gradient_to">
                      Gradient To <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="gradient_to"
                      type="color"
                      {...register('gradient_to')}
                      className="h-10"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Display Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cat_url">
                  Category URL <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cat_url"
                  {...register('cat_url', { required: 'Category URL is required' })}
                  placeholder="/shop"
                />
                {errors.cat_url && (
                  <p className="text-sm text-destructive">{errors.cat_url.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  type="number"
                  min={0}
                  {...register('position', { valueAsNumber: true })}
                />
                <p className="text-xs text-muted-foreground">
                  Display order (0 = first)
                </p>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">Active</Label>
                <Switch
                  id="is_active"
                  checked={isActive}
                  onCheckedChange={(v) => setValue('is_active', v, { shouldDirty: true })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Schedule Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="starts_at">Start Date</Label>
                <Input
                  id="starts_at"
                  type="datetime-local"
                  {...register('starts_at')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ends_at">End Date</Label>
                <Input
                  id="ends_at"
                  type="datetime-local"
                  {...register('ends_at')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Meta Info */}
          <Card>
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Store ID</span>
                <span className="font-medium">{banner.store_id}</span>
              </div>
              {banner.created_at && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">
                    {new Date(banner.created_at).toLocaleDateString()}
                  </span>
                </div>
              )}
              {banner.updated_at && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Updated</span>
                  <span className="font-medium">
                    {new Date(banner.updated_at).toLocaleDateString()}
                  </span>
                </div>
              )}
              {banner.deleted_at && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground text-destructive">Deleted</span>
                  <span className="font-medium text-destructive">
                    {new Date(banner.deleted_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
