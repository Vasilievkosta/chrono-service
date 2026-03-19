import { NavLink, Outlet } from 'react-router-dom';

export function MainLayout() {
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

            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? 'app-nav__link active' : 'app-nav__link'
              }
            >
              About
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}
