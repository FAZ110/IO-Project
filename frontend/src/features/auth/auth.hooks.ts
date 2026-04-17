import {useMutation, UseMutationOptions} from '@tanstack/react-query';
import { authService } from './auth.service';
import type {AuthResponse, RegisterRequest} from "@/features/auth/auth.types.ts";

export const useRegister = (options?: UseMutationOptions<AuthResponse, Error, RegisterRequest>) => {
  return useMutation({
    mutationFn: authService.register,
    ...options
  });
};