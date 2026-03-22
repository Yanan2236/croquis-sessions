import { Link } from "react-router-dom";
import styles from "./styles.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.brand}>© LineLoop</p>

        <nav className={styles.nav} aria-label="Footer">
          <Link to="/terms" className={styles.link}>
            利用規約
          </Link>
          <Link to="/privacy" className={styles.link}>
            プライバシーポリシー
          </Link>
          <Link to="/contact" className={styles.link}>
            お問い合わせ
          </Link>
        </nav>
      </div>
    </footer>
  );
};