import api from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type { ChangePasswordRequest } from './profile.types';

export const profileService = {
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await api.post(ENDPOINTS.ME.PASSWORD, data);
  },
};
