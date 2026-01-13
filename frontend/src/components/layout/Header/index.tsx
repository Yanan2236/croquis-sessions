import { Link } from 'react-router-dom';

import styles from './styles.module.css';

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <Link to="/" className={styles.logoLink}>
            <h1 className={styles.logoText}>Logo</h1>
          </Link>
        </div>

        <nav className={styles.nav}>
          <Link to="/sessions" className={styles.navLink}>Sessions</Link>
          <Link to="/sessions/new" className={styles.navLink}>New Session</Link>
        </nav>
      </div>
    </header>
  );
}