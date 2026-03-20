import { Route, Routes } from 'react-router-dom';

import { AdminPage } from '../../pages/admin/AdminPage';
import { AdminDashboardPage } from '../../pages/admin-dashboard/AdminDashboardPage';
import { HomePage } from '../../pages/home/HomePage';
import { MainLayout } from '../../shared/ui/layout/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
