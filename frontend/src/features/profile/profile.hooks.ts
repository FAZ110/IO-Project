import { useMutation } from '@tanstack/react-query';
import { profileService } from './profile.service';
import type { ChangePasswordRequest } from './profile.types';

export const useChangePasswordMutation = () =>
  useMutation({
    mutationFn: (data: ChangePasswordRequest) => profileService.changePassword(data),
  });
