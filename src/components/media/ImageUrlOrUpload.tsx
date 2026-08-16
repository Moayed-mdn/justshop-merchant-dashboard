'use client';

/**
 * ImageUrlOrUpload — dual-mode image input.
 * Merchants can either type/paste a URL or upload a file from their device.
 * Renders a tab switcher; value is always a plain string (URL or storage path).
 */

import { useState } from 'react';
import { Link, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GenericImageUploader } from './GenericImageUploader';
import type { MediaContext } from '@/types/media';

type Mode = 'url' | 'upload';

interface ImageUrlOrUploadProps {
  value: string;
  onChange: (value: string) => void;
  storeSlug: string;
  context?: MediaContext;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function ImageUrlOrUpload({
  value,
  onChange,
  storeSlug,
  context = 'cms',
  label,
  placeholder = 'https://example.com/image.jpg',
  disabled = false,
}: ImageUrlOrUploadProps) {
  // If the current value looks like a storage path (not starting with http), start on upload tab
  const [mode, setMode] = useState<Mode>(() =>
    value && !value.startsWith('http') ? 'upload' : 'url',
  );

  return (
    <div className="space-y-2">
      {label && <Label className="text-sm font-medium">{label}</Label>}

      {/* Mode switcher */}
      <div className="flex rounded-md border overflow-hidden w-fit text-xs">
        <button
          type="button"
          onClick={() => setMode('url')}
          disabled={disabled}
          className={[
            'flex items-center gap-1.5 px-3 py-1.5 transition-colors',
            mode === 'url'
              ? 'bg-primary text-primary-foreground'
              : 'bg-background text-muted-foreground hover:bg-muted',
          ].join(' ')}
        >
          <Link className="h-3 w-3" />
          URL
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          disabled={disabled}
          className={[
            'flex items-center gap-1.5 px-3 py-1.5 transition-colors',
            mode === 'upload'
              ? 'bg-primary text-primary-foreground'
              : 'bg-background text-muted-foreground hover:bg-muted',
          ].join(' ')}
        >
          <Upload className="h-3 w-3" />
          Upload
        </button>
      </div>

      {/* URL mode - supports URLs OR icon names */}
      {mode === 'url' && (
        <>
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
          />
          <p className="text-xs text-muted-foreground">
            Enter a URL, icon name (e.g., shield-check, users), or path
          </p>
        </>
      )}

      {/* Upload mode */}
      {mode === 'upload' && (
        <GenericImageUploader
          value={value}
          onChange={onChange}
          storeSlug={storeSlug}
          context={context}
          disabled={disabled}
        />
      )}
    </div>
  );
}
