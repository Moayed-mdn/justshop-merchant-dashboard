'use client';

/**
 * IconOrImage - Smart resolver for icon/image values
 * 
 * Handles three types of values:
 * 1. Lucide icon names (e.g., "shield-check", "users") → renders as Lucide React component
 * 2. External URLs (e.g., "https://...") → renders as <img>
 * 3. Storage paths (e.g., "storage/...", "/media/...") → renders as <img>
 * 
 * This prevents ERR_BLOCKED_BY_ORB errors by NOT making HTTP requests for icon names.
 */

import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface IconOrImageProps extends Omit<LucideProps, 'ref'> {
  value?: string | null;
  alt?: string;
  className?: string;
  imageClassName?: string;
}

function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

function isImagePath(value: string): boolean {
  return (
    value.startsWith('/') ||
    value.startsWith('storage/') ||
    value.startsWith('media/') ||
    /\.(svg|png|jpe?g|gif|webp|avif)(\?.*)?$/i.test(value)
  );
}

/**
 * Convert kebab-case or snake_case to PascalCase for Lucide icon lookup
 * Examples:
 *   "shield-check" → "ShieldCheck"
 *   "users" → "Users"
 *   "cpu" → "Cpu"
 */
function toPascalCase(value: string): string {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1).toLowerCase()
    )
    .join('');
}

function resolveLucideIcon(value: string) {
  const iconName = toPascalCase(value);
  
  const icons =
    LucideIcons as Record<
      string,
      React.ComponentType<LucideProps>
    >;
  
  return icons[iconName] ?? null;
}

export function IconOrImage({
  value,
  alt = '',
  className,
  imageClassName,
  ...iconProps
}: IconOrImageProps) {
  if (!value?.trim()) {
    return null;
  }
  
  const normalizedValue = value.trim();
  
  // 1. External image URL
  if (isHttpUrl(normalizedValue)) {
    return (
      <img
        src={normalizedValue}
        alt={alt}
        className={imageClassName ?? className}
      />
    );
  }
  
  // 2. Uploaded/storage image
  if (isImagePath(normalizedValue)) {
    return (
      <img
        src={normalizedValue}
        alt={alt}
        className={imageClassName ?? className}
      />
    );
  }
  
  // 3. Lucide icon name
  const Icon = resolveLucideIcon(normalizedValue);
  
  if (Icon) {
    return <Icon {...iconProps} className={className} />;
  }
  
  // 4. Unknown value: fail safely (don't make a network request)
  return null;
}
