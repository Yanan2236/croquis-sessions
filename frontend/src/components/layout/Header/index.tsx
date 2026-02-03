import { NavLink, Link } from "react-router-dom";

import styles from "./styles.module.css";
import { useLogoutAndRedirectMutation } from "@/features/accounts/mutations/useLogoutAndRedirectMutation";

export const Header = () => {
  const logoutMutation = useLogoutAndRedirectMutation();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.navLink} ${isActive ? styles.active : ""}`;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logoLink}>
          <span className={styles.logoText}>LineLoop</span>
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          <NavLink to="/subjects" className={navClass} end>
            モチーフ
          </NavLink>

          <NavLink to="/sessions" className={navClass} end>
            クロッキー記録
          </NavLink>

          <NavLink to="/sessions/new" className={navClass}>
            新規クロッキー
          </NavLink>

          <div className={styles.divider} aria-hidden />

          <button
            type="button"
            onClick={() => logoutMutation.mutate()}
            className={styles.logoutButton}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? "ログアウト中…" : "ログアウト"}
          </button>
        </nav>
      </div>
    </header>
  );
};
