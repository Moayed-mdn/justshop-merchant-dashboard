import { useEffect, useState } from 'react';

/**
 * Ensures loading states display for a minimum duration to prevent
 * flash-of-loading-state on fast connections.
 * 
 * @param isLoading - The actual loading state from data fetching
 * @param minimumMs - Minimum time to show loading state (default: 300ms)
 * @returns Boolean indicating whether to show loading UI
 * 
 * @example
 * const { data, isLoading } = useQuery(...);
 * const showLoading = useMinimumLoadingTime(isLoading);
 * 
 * if (showLoading) return <Skeleton />;
 */
export function useMinimumLoadingTime(isLoading: boolean, minimumMs = 300): boolean {
  const [showLoading, setShowLoading] = useState(isLoading);
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (isLoading) {
      // Started loading
      setShowLoading(true);
      setLoadingStartTime(Date.now());
    } else if (loadingStartTime !== null) {
      // Finished loading - check if minimum time has elapsed
      const elapsed = Date.now() - loadingStartTime;
      const remaining = minimumMs - elapsed;

      if (remaining > 0) {
        // Wait for remaining time before hiding loading state
        const timer = setTimeout(() => {
          setShowLoading(false);
          setLoadingStartTime(null);
        }, remaining);

        return () => clearTimeout(timer);
      } else {
        // Minimum time already elapsed
        setShowLoading(false);
        setLoadingStartTime(null);
      }
    }
  }, [isLoading, loadingStartTime, minimumMs]);

  return showLoading;
}
