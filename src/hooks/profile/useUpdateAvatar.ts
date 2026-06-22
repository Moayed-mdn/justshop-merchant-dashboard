/**
 * Hook for updating user avatar.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAvatar } from '@/lib/api/profile';
import type { ApiError } from '@/types/api';
import { toast } from 'sonner';

export function useUpdateAvatar() {
  const queryClient = useQueryClient();

  return useMutation<unknown, ApiError, File>({
    mutationFn: (file: File) => updateAvatar(file),
    onSuccess: () => {
      // Invalidate both profile and bootstrap queries
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['bootstrap'] });
      toast.success('Avatar updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update avatar');
    },
  });
}
