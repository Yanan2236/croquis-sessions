import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';

export const RootLayout = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}