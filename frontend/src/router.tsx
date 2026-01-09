import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '@/routes/RootLayout';
import { Home } from '@/routes/Home';
import { NotFound } from '@/routes/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
    ],
  },
]);