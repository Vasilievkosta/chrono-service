import { Route, Routes } from 'react-router-dom';

import { AboutPage } from '../../pages/about/AboutPage';
import { HomePage } from '../../pages/home/HomePage';
import { MainLayout } from '../../shared/ui/layout/MainLayout';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>
    </Routes>
  );
}

