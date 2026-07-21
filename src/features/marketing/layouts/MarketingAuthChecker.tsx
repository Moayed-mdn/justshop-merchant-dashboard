'use client';

import { useEffect, useState } from 'react';
import { clientApi } from '@/lib/api/client';
import { API_ROUTES } from '@/config/routes';
import MarketingNavbar from '@/features/marketing/components/MarketingNavbar';

interface MerchantUser {
  id: number;
  name: string;
  email: string;
  stores?: Array<{ slug: string }>;
}

/**
 * Client-side component that checks authentication state
 * and renders the appropriate navbar.
 * 
 * This component independently fetches /me to determine auth state
 * without relying on BootstrapProvider (which only loads on protected routes).
 */
export function MarketingAuthChecker() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [storeSlug, setStoreSlug] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      console.log('[MarketingAuthChecker] Starting auth check...');
      try {
        const endpoint = API_ROUTES.merchant.auth.me();
        console.log('[MarketingAuthChecker] Calling endpoint:', endpoint);
        
        const response = await clientApi.get<{ success: boolean; data: MerchantUser }>(
          endpoint
        );
        
        console.log('[MarketingAuthChecker] Response received:', response);
        
        if (response.success && response.data) {
          setIsAuthenticated(true);
          const firstStore = response.data.stores?.[0];
          setStoreSlug(firstStore?.slug ?? null);
          console.log('[MarketingAuthChecker] User authenticated, store:', firstStore?.slug);
        } else {
          setIsAuthenticated(false);
          setStoreSlug(null);
          console.log('[MarketingAuthChecker] Response success=false or no data');
        }
      } catch (error) {
        // User is not authenticated or session expired
        console.log('[MarketingAuthChecker] Auth check failed (user not authenticated):', error);
        setIsAuthenticated(false);
        setStoreSlug(null);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  // Show skeleton or default state while loading
  if (isLoading) {
    return (
      <MarketingNavbar 
        isAuthenticated={false} 
        storeSlug={null} 
      />
    );
  }

  return (
    <MarketingNavbar 
      isAuthenticated={isAuthenticated} 
      storeSlug={storeSlug} 
    />
  );
}
