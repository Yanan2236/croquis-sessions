import { Link } from 'react-router-dom';

import { useLogoutAndRedirectMutation } from '@/features/accounts/mutations/useLogoutAndRedirectMutation';
import styles from './styles.module.css';

export const Header = () => {
  const logoutMutation = useLogoutAndRedirectMutation();

  const handleLogout = () => {
    logoutMutation.mutate(); 
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <Link to="/" className={styles.logoLink}>
            <h1 className={styles.logoText}>Logo</h1>
          </Link>
        </div>

        <nav className={styles.nav}>
          <Link to="/subjects" className={styles.navLink}>Subjects</Link>
          <Link to="/sessions" className={styles.navLink}>Sessions</Link>
          <Link to="/sessions/new" className={styles.navLink}>New Session</Link>
          <button
            onClick={handleLogout}
            className={styles.logoutButton}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </button>
        </nav>
      </div>
    </header>
  );
}