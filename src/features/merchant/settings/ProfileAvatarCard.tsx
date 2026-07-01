'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useUpdateAvatar } from '@/hooks/profile/useUpdateAvatar';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Profile Avatar Card.
 * Allows uploading and updating user avatar.
 */
export function ProfileAvatarCard() {
  const t = useTranslations('settings');
  const user = useBootstrapStore((state) => state.user);
  const updateAvatarMutation = useUpdateAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error(t('profile.avatar.invalidFileType'));
      return;
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast.error(t('profile.avatar.fileTooLarge'));
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload avatar
    try {
      await updateAvatarMutation.mutateAsync(file);
      setPreviewUrl(null);
    } catch (error) {
      setPreviewUrl(null);
      // Error handling is done in the hook
    }

    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const avatarUrl = previewUrl || user?.avatar_url || undefined;
  const isPending = updateAvatarMutation.isPending;

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          <CardTitle>{t('profile.avatar.title')}</CardTitle>
        </div>
        <CardDescription>{t('profile.avatar.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          {/* Avatar Preview */}
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarUrl} alt={user?.name || 'User'} />
            <AvatarFallback className="text-2xl">
              {user?.name ? getInitials(user.name) : 'U'}
            </AvatarFallback>
          </Avatar>

          {/* Upload Controls */}
          <div className="flex-1 space-y-3">
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={handleUploadClick}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('profile.avatar.uploading')}
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    {t('profile.avatar.upload')}
                  </>
                )}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                className="hidden"
                disabled={isPending}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              <p>{t('profile.avatar.recommended')}</p>
              <p>{t('profile.avatar.maxSize')}</p>
              <p>{t('profile.avatar.supportedFormats')}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
