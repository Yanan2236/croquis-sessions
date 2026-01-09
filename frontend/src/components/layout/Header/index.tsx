import styles from '.styles.module.css';

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Croquis Sessions</h1>
      </div>
    </header>
  );
}