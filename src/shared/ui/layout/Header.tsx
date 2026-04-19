import { Link, NavLink } from 'react-router-dom';

import styles from './Header.module.css';

interface HeaderNavItem {
  to: string;
  label: string;
}

interface HeaderProps {
  navItems: HeaderNavItem[];
  authed: boolean;
  onLogout: () => void;
}

export function Header({ navItems, authed, onLogout }: HeaderProps) {
  return (
    <header className={`${styles.header} app-header`}>
      <div className={`${styles.inner} app-header__inner`}>
        <Link to="/" className={`${styles.brand} app-brand`} aria-label="ChronoService home">
          <img
            className={`${styles.brandImage} app-brand__image`}
            src="/assets/branding/logo-chronoservice.png"
            alt="ChronoService"
          />
        </Link>

        <nav className={`${styles.nav} app-nav`}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${styles.navLink} app-nav__link ${isActive ? `${styles.navLinkActive} active` : ''}`.trim()
              }
            >
              {item.label}
            </NavLink>
          ))}

          {authed ? (
            <button
              type="button"
              className={`${styles.navAction} app-nav__action`}
              onClick={onLogout}
            >
              Logout
            </button>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
