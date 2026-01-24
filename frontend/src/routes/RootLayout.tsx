import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';

import styles from './RootLayout.module.css'
import { IncompleteSessionBanner } from '@/components/layout/IncompleteSessionBanner';

export const RootLayout = () => {
  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <IncompleteSessionBanner />
          <Outlet />
        </div>
      </main>
    </div>
  );
};


