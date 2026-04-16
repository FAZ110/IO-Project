import { createContext, useContext } from 'react';

export interface AuthContextType {
  // accessToken: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  // isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('Unexpected error: useAuth must be used within an AuthProvider');
  return context;
};