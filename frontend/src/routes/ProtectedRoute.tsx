import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../providers/AuthContext';

interface ProtectedRouteProps {
    redirectTo: string;
}

export const ProtectedRoute = ({ redirectTo }: ProtectedRouteProps) => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} replace />;
};