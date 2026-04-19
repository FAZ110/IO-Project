import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../providers/AuthContext';
import type { UserRole } from '@/features/auth/auth.types';

interface ProtectedRouteProps {
    redirectTo: string;
    allowedRoles?: UserRole[];
    unauthorizedRedirectTo?: string;
}

export const ProtectedRoute = ({ redirectTo, allowedRoles, unauthorizedRedirectTo = '/unauthorized' }: ProtectedRouteProps) => {
    const { isAuthenticated, userRole } = useAuth();

    if (!isAuthenticated) return <Navigate to={redirectTo} replace />;
    if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
        return <Navigate to={unauthorizedRedirectTo} replace />;
    }

    return <Outlet />;
};
