import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';

import styles from './RootLayout.module.css'

export const RootLayout = () => {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};


