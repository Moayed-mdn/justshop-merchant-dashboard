'use client';

/**
 * Asset uploader component.
 * Drag-and-drop file upload with preview and type selection.
 */

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useBootstrapStore } from '@/stores/bootstrapStore';
import { useUploadAsset } from '@/hooks/assets/useAssetMutations';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, X, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { AssetType } from '@/types/asset';

interface AssetUploaderProps {
  onClose: () => void;
  onSuccess: () => void;
  defaultType?: AssetType;
}

export function AssetUploader({
  onClose,
  onSuccess,
  defaultType = 'other',
}: AssetUploaderProps) {
  const t = useTranslations();
  const activeStore = useBootstrapStore((state) => state.activeStore);
  const activeStoreId = activeStore ? String(activeStore.id) : null;
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [assetType, setAssetType] = useState<AssetType>(defaultType);
  const [altText, setAltText] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const uploadMutation = useUploadAsset(activeStoreId!);

  const handleFileSelect = useCallback((selectedFile: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error(t('assets.invalidFileType'));
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (selectedFile.size > maxSize) {
      toast.error(t('assets.fileTooLarge'));
      return;
    }

    setFile(selectedFile);

    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  }, [t]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        handleFileSelect(droppedFile);
      }
    },
    [handleFileSelect]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error(t('assets.noFileSelected'));
      return;
    }

    try {
      await uploadMutation.mutateAsync({
        file,
        asset_type: assetType,
        alt_text: altText || undefined,
      });

      toast.success(t('assets.uploadSuccess'));
      onSuccess();
    } catch (error) {
      toast.error(t('assets.uploadError'));
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('assets.uploadAsset')}</DialogTitle>
          <DialogDescription>{t('assets.uploadDescription')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* File Upload Area */}
          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                transition-colors
                ${
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-primary/50'
                }
              `}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/*"
                onChange={handleInputChange}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {t('assets.dropOrClick')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('assets.supportedFormats')}
                    </p>
                  </div>
                </div>
              </label>
            </div>
          ) : (
            /* File Preview */
            <div className="relative border rounded-lg p-4">
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={handleRemoveFile}
              >
                <X className="h-4 w-4" />
              </Button>

              {preview ? (
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-24 bg-muted rounded overflow-hidden flex-shrink-0">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Asset Type */}
          <div className="space-y-2">
            <Label htmlFor="asset-type">{t('assets.assetType')}</Label>
            <Select value={assetType} onValueChange={(v) => setAssetType(v as AssetType)}>
              <SelectTrigger id="asset-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="logo">{t('assets.logo')}</SelectItem>
                <SelectItem value="favicon">{t('assets.favicon')}</SelectItem>
                <SelectItem value="banner">{t('assets.banner')}</SelectItem>
                <SelectItem value="other">{t('assets.other')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Alt Text */}
          <div className="space-y-2">
            <Label htmlFor="alt-text">{t('assets.altText')}</Label>
            <Input
              id="alt-text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder={t('assets.altTextPlaceholder')}
            />
            <p className="text-xs text-muted-foreground">
              {t('assets.altTextHelper')}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file || uploadMutation.isPending}
          >
            {uploadMutation.isPending ? t('common.uploading') : t('common.upload')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
