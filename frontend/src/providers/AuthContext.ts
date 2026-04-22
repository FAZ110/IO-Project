  import { createContext, useContext } from 'react';
  import type {UserInfo} from '@/features/auth/auth.types';

  export interface AuthContextType {
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    user: UserInfo | null;
  }

  export const AuthContext = createContext<AuthContextType | undefined>(undefined);

  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('Unexpected error: useAuth must be used within an AuthProvider');
    return context;
  };