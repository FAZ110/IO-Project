import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { GuestRoute } from './GuestRoute';
import { PATHS } from './paths';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { CreateProjectPage } from '@/pages/CreateProjectPage';
import { AdminUsersPage } from '../pages/AdminUsersPage';
import { AdminUserDetailsPage } from '../pages/AdminUserDetailsPage';
import { ROUTE_PARAMS } from './paths';
import { UserRole } from '@/features/auth/auth.types';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route element={<GuestRoute redirectTo={PATHS.ROOT} />}>
        <Route path={PATHS.LOGIN} element={<LoginPage />} />
        <Route path={PATHS.REGISTER} element={<RegisterPage />} />
      </Route>

      {/* PROTECTED ROUTES */}
      <Route element={<ProtectedRoute redirectTo={PATHS.LOGIN} />}>
        <Route path={PATHS.ROOT} element={<div>DASHBOARD</div>} />
        <Route path={PATHS.CREATEPROJECT} element={<CreateProjectPage/>} />
      </Route>

      {/* ADMIN ROUTES */}
      <Route element={<ProtectedRoute redirectTo={PATHS.LOGIN} allowedRoles={[UserRole.ADMINISTRATOR]} />}>
        <Route path={PATHS.ADMIN_USERS} element={<AdminUsersPage />} />
        <Route path={`${PATHS.ADMIN_USERS}/:${ROUTE_PARAMS.USER_ID}`} element={<AdminUserDetailsPage />} />
      </Route>

      {/* FALLBACK - 404 */}
      <Route path="*" element={<Navigate to={PATHS.ROOT} replace />} />

      
    </Routes>
  );
};
