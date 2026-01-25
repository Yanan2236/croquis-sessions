import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { useMatches } from 'react-router-dom';

import styles from './RootLayout.module.css'
import { IncompleteSessionBanner } from '@/components/layout/IncompleteSessionBanner';

type RouteHandle = {
  hideIncompleteBanner?: boolean;
}

export const RootLayout = () => {
  const matches = useMatches();
  const hideBanner = matches.some(
    (m) => (m.handle as RouteHandle | undefined)?.hideIncompleteBanner
  );

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          {!hideBanner && <IncompleteSessionBanner />}
          <Outlet />
        </div>
      </main>
    </div>
  );
};


