import { useMutation } from '@tanstack/react-query';
import { authService } from './auth.service';
import { useAuth } from '@/providers/AuthContext';

export const useAuthActions = () => {
  const { login, logout } = useAuth();

  const handleAuthSuccess = (data: { accessToken: string; }) => login(data.accessToken);

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: handleAuthSuccess
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: handleAuthSuccess
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => logout()
  });

  return {
    registerUser: registerMutation.mutate,
    loginUser: loginMutation.mutate,
    logoutUser: logoutMutation.mutate,

    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending
  };
};
