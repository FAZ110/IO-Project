import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../providers/AuthContext';
import type { UserRole } from '@/features/auth/auth.types';
import { PATHS } from './paths';

interface AuthorizedRouteProps {
    allowedRoles?: UserRole[];
}

export const AuthorizedRoute = ({ allowedRoles }: AuthorizedRouteProps) => {
  const { user } = useAuth();

  if (!user) return <Navigate to={PATHS.LOGIN} replace />;
  
  const hasAccess = allowedRoles?.includes(user.role);
  return hasAccess ? <Outlet /> : <Navigate to={PATHS.ROOT} replace />;
};