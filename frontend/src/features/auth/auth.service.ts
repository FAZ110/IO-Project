import api from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import type { LoginRequest, RegisterRequest, AuthResponse } from './auth.types';

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, data);
    return res.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, data);
    return res.data;
  }
};