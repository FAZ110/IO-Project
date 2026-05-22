import { Routes, Route, Navigate } from 'react-router-dom';
import { GuestRoute } from './GuestRoute';
import { PATHS, ROUTE_PARAMS } from './paths';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { CreateProjectPage } from '@/pages/CreateProjectPage';
import { ProjectDetailsPage } from '@/pages/ProjectDetailsPage.tsx';
import { AdminUsersPage } from '../pages/AdminUsersPage';
import { AdminUserDetailsPage } from '../pages/AdminUserDetailsPage';
import { NotificationPage } from "@/pages/NotificationPage.tsx";
import { UserRole } from '@/features/auth/auth.types';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProfilePage } from "@/pages/ProfilePage";
import { DashboardPage } from "@/pages/DashboardPage";
import { AuthenticatedRoute } from '@/routes/AuthenticatedRoute';
import { AuthorizedRoute } from '@/routes/AuthorizedRoute';
import { EmployeeAssignmentsPage } from '@/pages/EmployeeAssignmentsPage';
import { QualificationRequestsPage } from '@/pages/QualificationRequestsPage';
import { CreateProjectGroupPage } from '@/pages/CreateProjectGroupPage';
import { ProjectRegistryPage } from '@/pages/ProjectRegistryPage';
import { useAuth } from '@/providers/AuthContext';

export const AppRoutes = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.ADMINISTRATOR;

  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route element={<GuestRoute redirectTo={PATHS.ROOT} />}>
        <Route path={PATHS.LOGIN} element={<LoginPage />} />
        <Route path={PATHS.REGISTER} element={<RegisterPage />} />
      </Route>

      {/* PROTECTED ROUTES */}
      <Route element={<AuthenticatedRoute />}>
        <Route element={<MainLayout/>}>
          {/* GLOBAL ROUTES */}
          <Route path={PATHS.ROOT} element={isAdmin ? <Navigate to={PATHS.ADMIN_USERS} replace /> : <DashboardPage />} />
          <Route path={PATHS.PROFILE} element={<ProfilePage />} />
          <Route path={PATHS.PROJECT(`:${ROUTE_PARAMS.PROJECT_ID}`)} element={<ProjectDetailsPage />} />
          <Route path={PATHS.PROJECTS_REGISTRY} element={<ProjectRegistryPage />} /> {/* <-- Przywrócone z developa */}
          <Route path={PATHS.NOTIFICATION} element={<NotificationPage />} />

          {/* LINEAR MANAGER ROUTES */}
          <Route element={<AuthorizedRoute allowedRoles={[UserRole.LINEAR_MANAGER, UserRole.AUTHORITY]} />}>
            <Route path={PATHS.PROJECT_REQUESTS} element={<EmployeeAssignmentsPage />} />
            <Route path={PATHS.QUALIFICATION_REQUESTS} element={<QualificationRequestsPage />} />
          </Route>

          {/* PROJECT MANAGER ROUTES */}
          <Route element={<AuthorizedRoute allowedRoles={[UserRole.PROJECT_MANAGER, UserRole.AUTHORITY]} />}>
            <Route path={PATHS.CREATE_PROJECT} element={<CreateProjectPage />} />
            <Route path={PATHS.CREATE_PROJECT_GROUP} element={<CreateProjectGroupPage />} />
          </Route>

          {/* ADMIN ROUTES */}
          <Route element={<AuthorizedRoute allowedRoles={[UserRole.ADMINISTRATOR]} />}>
            <Route path={PATHS.ADMIN_USERS} element={<AdminUsersPage />} />
            <Route path={PATHS.ADMIN_USER_DETAILS(`:${ROUTE_PARAMS.USER_ID}`)} element={<AdminUserDetailsPage />} />
          </Route>

        </Route>
      </Route>

      {/* FALLBACK - 404 */}
      <Route path="*" element={<Navigate to={PATHS.ROOT} replace />} />
    </Routes>
  );
};