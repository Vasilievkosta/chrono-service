import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { clearAuth, isAuthenticated, subscribeToAuthChange } from '../../lib/auth';

export function MainLayout() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(isAuthenticated());

  useEffect(() => {
    return subscribeToAuthChange(() => {
      setAuthed(isAuthenticated());
    });
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__inner">
          <div className="app-brand">Frontend App</div>

          <nav className="app-nav">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? 'app-nav__link active' : 'app-nav__link'
              }
            >
              Home
            </NavLink>

            {authed ? (
              <button type="button" className="app-nav__action" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  isActive ? 'app-nav__link active' : 'app-nav__link'
                }
              >
                Admin
              </NavLink>
            )}
          </nav>
        </div>
      </header>

      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}
