/**
 * Hook for updating user profile information.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfileInfo } from '@/lib/api/profile';
import type { UpdateProfileInfoPayload } from '@/lib/api/profile';
import type { ApiError } from '@/types/api';
import { toast } from 'sonner';

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<unknown, ApiError, UpdateProfileInfoPayload>({
    mutationFn: (payload: UpdateProfileInfoPayload) => updateProfileInfo(payload),
    onSuccess: () => {
      // Invalidate both profile and bootstrap queries
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['bootstrap'] });
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
}
