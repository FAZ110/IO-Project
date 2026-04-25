import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { GuestRoute } from './GuestRoute';
import { PATHS } from './paths';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { CreateProjectPage } from '@/pages/CreateProjectPage';
import { ProjectDetailsPage } from '@/pages/ProjectDetailsPage.tsx';
import { AdminUsersPage } from '../pages/AdminUsersPage';
import { AdminUserDetailsPage } from '../pages/AdminUserDetailsPage';
import { ROUTE_PARAMS } from './paths';
import { UserRole } from '@/features/auth/auth.types';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProfilePage } from "@/pages/ProfilePage";
import { DashboardPage } from "@/pages/DashboardPage";

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
        <Route element={<MainLayout/>}>
          <Route path={PATHS.ROOT} element={<DashboardPage/>} />
          <Route path={PATHS.PROFILE} element={<ProfilePage/>} />

          <Route element={<ProtectedRoute redirectTo={PATHS.ROOT} allowedRoles={[UserRole.PROJECT_MANAGER]} />}>
            <Route path={PATHS.CREATE_PROJECT} element={<CreateProjectPage/>} />
          </Route>
          <Route path={PATHS.PROJECT(`:${ROUTE_PARAMS.PROJECT_ID}`)} element={<ProjectDetailsPage />} />


          {/* ADMIN ROUTES */}
          <Route element={<ProtectedRoute redirectTo={PATHS.LOGIN} allowedRoles={[UserRole.ADMINISTRATOR]} />}>
            <Route path={PATHS.ADMIN_USERS} element={<AdminUsersPage />} />
            <Route path={`${PATHS.ADMIN_USERS}/:${ROUTE_PARAMS.USER_ID}`} element={<AdminUserDetailsPage />} />
          </Route>
        </Route>
      </Route>

      {/* FALLBACK - 404 */}
      <Route path="*" element={<Navigate to={PATHS.ROOT} replace />} />

      
    </Routes>
  );
};
