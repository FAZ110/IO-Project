import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { useCallback, useEffect, useState } from "react";
import { setAccessToken } from "@/api/client.ts";
import { authService } from "@/features/auth/auth.service.ts";
import { useQueryClient } from "@tanstack/react-query";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const login = useCallback((token: string) => {
    setAccessToken(token);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    setAccessToken(null);
    setIsAuthenticated(false);
    queryClient.clear();
  }, [queryClient]);

  useEffect(() => {
    authService.refresh()
      .then(({ accessToken }) => login(accessToken))
      .catch(() => logout())
      .finally(() => setIsLoading(false));

    window.addEventListener('auth-logout', logout);
    return () => window.removeEventListener('auth-logout', logout);
  }, [login, logout]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Ładowanie aplikacji...</div>;
  }

  return (
    <AuthContext.Provider value={{ login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};