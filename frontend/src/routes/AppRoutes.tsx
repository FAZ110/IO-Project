import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { GuestRoute } from './GuestRoute';
import { PATHS } from './paths';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { CreateProjectPage } from '@/pages/CreateProjectPage';

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
      </Route>

      {/* FALLBACK - 404 */}
      <Route path="*" element={<Navigate to={PATHS.ROOT} replace />} />

      <Route path={PATHS.CREATEPROJECT} element={<CreateProjectPage/>} />
    </Routes>
  );
};