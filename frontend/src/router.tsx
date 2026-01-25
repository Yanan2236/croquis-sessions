import { createBrowserRouter } from 'react-router-dom';

import { RootLayout } from '@/routes/RootLayout';
import { HomePage } from '@/routes/index';
import { NotFound } from '@/routes/NotFound';

import { NewSessionPage } from '@/routes/sessions/new';
import { SessionDetail } from '@/routes/sessions/run/$sessionId';
import { SessionFinishPage } from '@/routes/sessions/run/$sessionId/finish';
import { SessionDonePage } from '@/routes/sessions/run/$sessionId/done';
import { SessionLayout } from '@/routes/sessions/run/$sessionId/_layout';
import { SubjectsPage } from '@/routes/subjects';
import { SessionOverlayDetail } from '@/routes/sessions/view/$sessionId';
import { SessionsLayout } from '@/routes/sessions/_layout';
import { Sessions } from './routes/sessions';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <HomePage /> },

      {
        path: "sessions",
        children: [
          {
            element: <SessionsLayout />,
            children: [
              { index: true, element: null },
              { path: "view/:sessionId", element: <SessionOverlayDetail /> },
            ]
          },

          { path: "new", element: <NewSessionPage /> },

          {
            path: "run/:sessionId",
            element: <SessionLayout />,
            handle: { hideIncompleteBanner: true },
            children: [
              { index: true, element: <SessionDetail /> },
              { path: "finish", element: <SessionFinishPage /> },
              { path: "done", element: <SessionDonePage /> },
            ],
          },
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