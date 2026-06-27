/**
 * Hook for updating user profile information.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfileInfo } from '@/lib/api/profile';
import type { UpdateProfileInfoPayload } from '@/lib/api/profile';
import type { ApiError } from '@/types/api';
import { toast } from 'sonner';
import { useBootstrapStore } from '@/stores/bootstrapStore';

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const fetchBootstrap = useBootstrapStore((state) => state.fetchBootstrap);

  return useMutation<unknown, ApiError, UpdateProfileInfoPayload>({
    mutationFn: (payload: UpdateProfileInfoPayload) => updateProfileInfo(payload),
    onSuccess: async () => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['bootstrap'] });
      
      // Force refetch bootstrap to update user info immediately
      await fetchBootstrap();
      
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
}
