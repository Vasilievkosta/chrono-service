import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { clearAuth, isAuthenticated, subscribeToAuthChange } from '../../lib/auth';

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
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__inner">
          <Link to="/" className="app-brand" aria-label="ChronoService home">
            <img
              className="app-brand__image"
              src="/assets/branding/logo-chronoservice.png"
              alt="ChronoService"
            />
          </Link>

          <nav className="app-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive ? 'app-nav__link active' : 'app-nav__link'
                }
              >
                {item.label}
              </NavLink>
            ))}

            {authed ? (
              <button type="button" className="app-nav__action" onClick={handleLogout}>
                Logout
              </button>
            ) : null}
          </nav>
        </div>
      </header>

      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}
