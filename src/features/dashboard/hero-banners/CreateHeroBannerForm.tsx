'use client';

/**
 * Create Hero Banner Form Component
 * Handles creation of new promotional banners with translations in EN/AR
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from '@/lib/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { createHeroBanner } from '@/lib/api/hero-banners';
import type { CreateHeroBannerData, HeroVisualType, HeroLinkTarget } from '@/lib/api/hero-banners';
import { ROUTES } from '@/config/routes';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  storeId: string;
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

export default function CreateHeroBannerForm({ storeId }: Props) {
  const t = useTranslations('heroBanners');
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeLocale, setActiveLocale] = useState<'en' | 'ar'>('en');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      cat_url: '/shop',
      position: 0,
      visual_type: 'image',
      image_path: '',
      gradient_from: '#000000',
      gradient_to: '#ffffff',
      link_url: '',
      link_text: '',
      link_target: '_self',
      is_active: true,
      starts_at: '',
      ends_at: '',
      title_en: '',
      subtitle_en: '',
      cta_text_en: 'Shop Now',
      title_ar: '',
      subtitle_ar: '',
      cta_text_ar: 'تسوق الآن',
    },
  });

  const visualType = watch('visual_type');
  const isActive = watch('is_active');
  const linkTarget = watch('link_target');

  const createMutation = useMutation({
    mutationFn: (data: CreateHeroBannerData) => createHeroBanner(storeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-banners', storeId] });
      toast.success('Hero banner created successfully');
      router.push(ROUTES.merchant.heroBanners.list());
    },
    onError: (error: any) => {
      logger.error('Failed to create hero banner', { error });
      toast.error(error?.message || 'Failed to create hero banner');
    },
  });

  const onSubmit = async (values: FormValues) => {
    const data: CreateHeroBannerData = {
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

    await createMutation.mutateAsync(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Create Hero Banner</h1>
          <p className="text-muted-foreground">Add a new promotional banner</p>
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Banner'}
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
                  onValueChange={(value: HeroLinkTarget) => setValue('link_target', value)}
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
                  onValueChange={(value: HeroVisualType) => setValue('visual_type', value)}
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
                  <Label htmlFor="image_path">
                    Image Path <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="image_path"
                    {...register('image_path', {
                      required: visualType === 'image' ? 'Image path is required' : false,
                    })}
                    placeholder="hero/banner-image.jpg"
                  />
                  {errors.image_path && (
                    <p className="text-sm text-destructive">{errors.image_path.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Relative path in storage (e.g., hero/banner.jpg)
                  </p>
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
                  onCheckedChange={(v) => setValue('is_active', v)}
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
        </div>
      </div>
    </form>
  );
}
