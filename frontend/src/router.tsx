import { createBrowserRouter } from 'react-router-dom';

import { RootLayout } from '@/routes/RootLayout';
import { NotFound } from '@/routes/NotFound';

import { NewSessionPage } from '@/routes/sessions/new';
import { SessionDetail } from '@/routes/sessions/run/$sessionId';
import { SessionFinishPage } from '@/routes/sessions/run/$sessionId/finish';
import { SessionDonePage } from '@/routes/sessions/run/$sessionId/done';
import { SessionLayout } from '@/routes/sessions/run/$sessionId/_layout';
import { SubjectsPage } from '@/routes/subjects';
import { SessionOverlayDetail } from '@/routes/sessions/view/$sessionId';
import { SessionsLayout } from '@/routes/sessions/_layout';
import { PublicLayout } from '@/routes/PublicLayout';
import { LoginPage } from '@/routes/login';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { PublicGuard } from '@/components/auth/PublicGuard';
import { Sessions } from '@/routes/sessions';


export const router = createBrowserRouter([
  // Public
  {
    path: "/login",
    element: <PublicGuard />,
    children: [
      { 
        element: <PublicLayout />,
        errorElement: <NotFound />,
        children: [{ index: true, element: <LoginPage /> }],
      },
    ],
  },

  // Private（認証必須）
  {
    element: <AuthGuard />,
    children: [
      {
        path: "/",
        element: <RootLayout />,
        errorElement: <NotFound />,
        children: [
          { path: "sessions", children: [
            {
              element: <SessionsLayout />,
              children: [
                { index: true, element: <Sessions /> },
                { path: "view/:sessionId", element: <SessionOverlayDetail /> },
              ],
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
          ]},

          { path: "subjects", element: <SubjectsPage /> },

          { path: "*", element: <NotFound /> },
        ],
      },
    ],
  },
]);
