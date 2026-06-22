/**
 * Hook for fetching user profile.
 */

import { useQuery } from '@tanstack/react-query';
import { getProfile } from '@/lib/api/profile';
import type { ProfileData } from '@/lib/api/profile';
import type { ApiError } from '@/types/api';

export function useProfile() {
  return useQuery<ProfileData, ApiError>({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await getProfile();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
