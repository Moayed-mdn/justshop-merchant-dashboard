/**
 * Hook for updating user password.
 */

import { useMutation } from '@tanstack/react-query';
import { updatePassword } from '@/lib/api/profile';
import type { UpdatePasswordPayload } from '@/lib/api/profile';
import type { ApiError } from '@/types/api';
import { toast } from 'sonner';

export function useUpdatePassword() {
  return useMutation<unknown, ApiError, UpdatePasswordPayload>({
    mutationFn: (payload: UpdatePasswordPayload) => updatePassword(payload),
    onSuccess: () => {
      toast.success('Password updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update password');
    },
  });
}
