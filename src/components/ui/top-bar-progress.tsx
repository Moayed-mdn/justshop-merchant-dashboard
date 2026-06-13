'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TopBarProgressProps {
  className?: string;
}

/**
 * Subtle top-bar progress indicator for background loading states.
 * Uses indeterminate animation to indicate activity without blocking UI.
 */
export function TopBarProgress({ className }: TopBarProgressProps) {
  const [visible, setVisible] = useState(false);

  // Minimum display time to prevent flash
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 z-[100] h-1 bg-primary/10',
        className
      )}
    >
      <div
        className="h-full bg-primary animate-pulse"
        style={{
          width: '40%',
          animation: 'progress-slide 1.5s ease-in-out infinite',
        }}
      />
      <style jsx>{`
        @keyframes progress-slide {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(250%);
          }
          100% {
            transform: translateX(250%);
          }
        }
      `}</style>
    </div>
  );
}
