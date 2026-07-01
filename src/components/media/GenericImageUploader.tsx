'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { uploadImage, deleteImage } from '@/lib/api/media';
import type { MediaContext } from '@/types/media';

interface GenericImageUploaderProps {
  value: string; // image path or URL
  onChange: (path: string) => void;
  context: MediaContext;
  storeSlug: string;
  label?: string;
  disabled?: boolean;
  maxSizeMB?: number;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const DEFAULT_MAX_SIZE_MB = 5;

export function GenericImageUploader({
  value,
  onChange,
  context,
  storeSlug,
  label = 'Image',
  disabled = false,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
}: GenericImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute preview URL
  const previewUrl = value
    ? value.startsWith('http')
      ? value // External URL
      : `${process.env.NEXT_PUBLIC_API_URL || ''}/storage/${value}` // Local path
    : null;

  // Validate file
  const validateFile = useCallback(
    (file: File): string | null => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return 'Please upload a valid image file (JPEG, PNG, GIF, or WEBP)';
      }

      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        return `Image size must not exceed ${maxSizeMB}MB`;
      }

      return null;
    },
    [maxSizeMB]
  );

  // Upload file
  const uploadFile = useCallback(
    async (file: File) => {
      setError(null);

      // Validate
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      try {
        setUploading(true);
        setUploadProgress(0);

        // Simulate progress (since fetch doesn't provide real progress)
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => (prev < 90 ? prev + 10 : prev));
        }, 100);

        const response = await uploadImage(storeSlug, context, file);

        clearInterval(progressInterval);
        setUploadProgress(100);

        // Update parent with path
        onChange(response.data.path);

        // Reset progress after short delay
        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0);
        }, 500);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
        setUploading(false);
        setUploadProgress(0);
      }
    },
    [storeSlug, context, onChange, validateFile]
  );

  // Handle file selection
  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        uploadFile(file);
      }
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [uploadFile]
  );

  // Handle drag & drop
  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const file = event.dataTransfer.files[0];
      if (file) {
        uploadFile(file);
      }
    },
    [disabled, uploadFile]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!disabled) {
        setIsDragging(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Trigger file input click
  const triggerFileInput = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  }, [disabled]);

  // Handle remove
  const handleRemove = useCallback(async () => {
    if (!value || disabled) return;

    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      await deleteImage(storeSlug, context, value);
      onChange('');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed. Please try again.');
    }
  }, [value, disabled, storeSlug, context, onChange]);

  return (
    <div className="space-y-3">
      {label && (
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
      )}

      {/* Upload Area */}
      {!previewUrl && (
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center
            transition-colors cursor-pointer
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_TYPES.join(',')}
            className="hidden"
            onChange={handleFileSelect}
            disabled={disabled}
          />

          <div className="flex flex-col items-center">
            {uploading ? (
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-3" />
            ) : (
              <Upload className="w-12 h-12 text-gray-400 mb-3" />
            )}

            {!uploading && (
              <>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold text-blue-600">Click to upload</span>
                  {' '}or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF, WEBP up to {maxSizeMB}MB
                </p>
              </>
            )}
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 text-sm text-red-600">{error}</div>
          )}
        </div>
      )}

      {/* Preview Area */}
      {previewUrl && (
        <div className="relative">
          <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-48 object-cover"
              onError={(e) => {
                // Hide broken image
                e.currentTarget.style.display = 'none';
              }}
            />
            {!disabled && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 rounded-full shadow-lg"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Delete image</span>
              </Button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">Path: {value}</p>
        </div>
      )}
    </div>
  );
}
