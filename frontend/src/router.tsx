import { createBrowserRouter } from 'react-router-dom';

import { RootLayout } from '@/routes/RootLayout';
import { Home } from '@/routes/Home';
import { NotFound } from '@/routes/NotFound';

import { NewSessionPage } from '@/routes/sessions/new';
import { SessionDetail } from '@/routes/sessions/$sessionId';
import { SessionFinishedPage } from '@/routes/sessions/$sessionId/finished';
import { SessionLayout } from '@/routes/sessions/$sessionId/_layout';



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
          { 
            path: ':sessionId',
            element: <SessionLayout />,
            children: [
              { index: true, element: <SessionDetail /> },
              { path: 'finished', element: <SessionFinishedPage />}
            ] },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);