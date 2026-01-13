import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '@/routes/RootLayout';
import { Home } from '@/routes/Home';
import { NotFound } from '@/routes/NotFound';

import { NewSessionPage } from '@/routes/sessions/new';
import { SessionDetail } from '@/routes/sessions/$sessionId';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },

      {
        path: 'sessions',
        children: [
          //{ index: true, element: <Sessions />},
          { path: 'new', element: <NewSessionPage /> },
          { path: ':sessionId', element: <SessionDetail /> },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);