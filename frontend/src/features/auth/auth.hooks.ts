import { useMutation } from '@tanstack/react-query';
import { authService } from './auth.service';
import { useAuth } from '@/providers/AuthContext';

export const useRegister = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      login(data.accessToken);
    }
  });
};

export const useLogin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      login(data.accessToken);
    }
  });
};