import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import {useEffect, useState} from "react";
import api, {setAccessToken} from "@/api/client.ts";
import {ENDPOINTS} from "@/api/endpoints.ts";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.post(ENDPOINTS.AUTH.REFRESH);
        setAccessToken(res.data.accessToken);
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();

    const handleUnauthorized = async () => {
      setAccessToken(null);
      setIsAuthenticated(false);
    };

    window.addEventListener('auth-logout', handleUnauthorized);
    return () => window.removeEventListener('auth-logout', handleUnauthorized);
  }, [])

  const login = (token: string) => {
    setAccessToken(token);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await api.post(ENDPOINTS.AUTH.LOGOUT);
    } catch (e) {
      console.error('Błąd podczas wylogowywania', e);
    } finally {
      setAccessToken(null);
      setIsAuthenticated(false);
    }
  };


  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Ładowanie aplikacji...</div>;
  }

  return (
    <AuthContext.Provider value={{ login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};