import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/providers/AuthContext';
import { PATHS } from '@/routes/paths';

export const AuthenticatedRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to={PATHS.LOGIN} replace />;
};