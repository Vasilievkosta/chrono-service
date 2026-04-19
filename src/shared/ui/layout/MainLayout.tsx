import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { clearAuth, isAuthenticated, subscribeToAuthChange } from '../../lib/auth';
import { Header } from './Header';
import styles from './MainLayout.module.css';

export function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [authed, setAuthed] = useState(isAuthenticated());

  useEffect(() => {
    return subscribeToAuthChange(() => {
      setAuthed(isAuthenticated());
    });
  }, []);

  const isHomePage = location.pathname === '/';
  const isAdminArea = location.pathname.startsWith('/admin');

  const navItems = useMemo(() => {
    if (!authed) {
      return isAdminArea ? [] : [{ to: '/admin', label: 'Admin' }];
    }

    if (isHomePage) {
      return [{ to: '/admin/dashboard', label: 'Dashboard' }];
    }

    return [];
  }, [authed, isAdminArea, isHomePage]);

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  return (
    <div className={`${styles.shell} app-shell`}>
      <Header navItems={navItems} authed={authed} onLogout={handleLogout} />

      <main className={`${styles.content} app-content`}>
        <Outlet />
      </main>
    </div>
  );
}
