import { createContext, useContext } from 'react';
import type { UserRole } from '@/features/auth/auth.types';

export interface AuthContextType {
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  userRole: UserRole | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('Unexpected error: useAuth must be used within an AuthProvider');
  return context;
};