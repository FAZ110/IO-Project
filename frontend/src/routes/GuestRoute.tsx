import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../providers/AuthContext';

interface GuestRouteProps {
    redirectTo: string;
}

export const GuestRoute = ({ redirectTo }: GuestRouteProps) => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? <Navigate to={redirectTo} replace /> : <Outlet />;
};