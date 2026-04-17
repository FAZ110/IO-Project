import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // AUTORYZACJA - do implementacji
  return (
    <AuthContext.Provider value={{ login: () => { console.log('Logging in'); }, logout: () => { console.log('Logging out'); }, isAuthenticated: false }}>
      {children}
    </AuthContext.Provider>
  );
};