import { createBrowserRouter } from 'react-router-dom';

import { RootLayout } from '@/routes/RootLayout';
import { HomePage } from '@/routes/index';
import { NotFound } from '@/routes/NotFound';

import { NewSessionPage } from '@/routes/sessions/new';
import { SessionDetail } from '@/routes/sessions/$sessionId';
import { SessionFinishPage } from '@/routes/sessions/$sessionId/finish';
import { SessionDonePage } from '@/routes/sessions/$sessionId/done';
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
              { path: 'finish', element: <SessionFinishPage /> },
              { path: 'done', element: <SessionDonePage />}
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