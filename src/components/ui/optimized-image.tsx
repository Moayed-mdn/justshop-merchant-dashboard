'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'placeholder'> {
  fallback?: string;
  showSkeleton?: boolean;
}

/**
 * Optimized image component that prevents flash-of-unstyled-content.
 * Shows skeleton during load, then smoothly fades in the image.
 */
export function OptimizedImage({ 
  className, 
  alt, 
  fallback,
  showSkeleton = true,
  loading = 'lazy',
  ...props 
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component is mounted to prevent SSR/CSR mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Show skeleton during SSR/initial hydration
    return (
      <div className={cn('bg-muted animate-pulse', className)} />
    );
  }

  if (hasError && fallback) {
    return (
      <div className={cn('flex items-center justify-center bg-muted', className)}>
        <span className="text-xs text-muted-foreground">{fallback}</span>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={cn('flex items-center justify-center bg-muted', className)}>
        <svg
          className="h-6 w-6 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {/* Skeleton placeholder */}
      {isLoading && showSkeleton && (
        <div 
          className={cn(
            'absolute inset-0 animate-pulse bg-muted z-10',
            props.fill ? 'w-full h-full' : ''
          )}
          style={!props.fill ? { width: props.width, height: props.height } : undefined}
        />
      )}
      
      {/* Actual image */}
      <Image
        className={cn(
          'transition-all duration-500 ease-out',
          isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
        )}
        alt={alt}
        loading={loading}
        onLoad={(e) => {
          // Small delay to ensure smooth transition
          setTimeout(() => setIsLoading(false), 100);
        }}
        onError={(e) => {
          setIsLoading(false);
          setHasError(true);
        }}
        {...props}
      />
    </div>
  );
}
