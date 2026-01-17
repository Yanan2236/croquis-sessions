import { createBrowserRouter } from 'react-router-dom';

import { RootLayout } from '@/routes/RootLayout';
import { HomePage } from '@/routes/index';
import { NotFound } from '@/routes/NotFound';

import { NewSessionPage } from '@/routes/sessions/new';
import { SessionDetail } from '@/routes/sessions/$sessionId';
import { SessionFinishedPage } from '@/routes/sessions/$sessionId/finished';
import { SessionLayout } from '@/routes/sessions/$sessionId/_layout';
import { SubjectsPage } from '@/routes/subjects';



export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <HomePage /> },

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

      { 
        path: 'subjects',
        children: [
          { index: true, element: <SubjectsPage /> },
        ]
      },

      { path: '*', element: <NotFound /> },
    ],
  },
]);