import { createBrowserRouter } from 'react-router-dom';

import { RootLayout } from '@/routes/RootLayout';
import { NotFound } from '@/routes/NotFound';

import { NewSessionPage } from '@/routes/sessions/new';
import { SessionRunPage } from '@/routes/sessions/run/$sessionId';
import { SessionFinishPage } from '@/routes/sessions/run/$sessionId/finish';
import { SessionDonePage } from '@/routes/sessions/run/$sessionId/done';
import { SessionLayout } from '@/routes/sessions/run/$sessionId/_layout';
import { SubjectsPage } from '@/routes/subjects';
import { SessionOverlayDetail } from '@/routes/sessions/view/$sessionId';
import { SessionsLayout } from '@/routes/sessions/_layout';
import { PublicLayout } from '@/routes/auth/PublicLayout';
import { LoginPage } from '@/routes/auth/login';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { PublicGuard } from '@/components/auth/PublicGuard';
import { Sessions } from '@/routes/sessions';
import { SignupPage } from '@/routes/auth/signup';
import { HomePage } from '@/routes';
import { SubjectSessionsPage } from '@/routes/sessions/$subjectId';


export const router = createBrowserRouter([
  // Public
  {
    path: "/auth",
    element: <PublicGuard />,
    errorElement: <NotFound />,
    children: [
      { 
        element: <PublicLayout />,
        children: [
          { path: "login", element: <LoginPage /> },
          { path: "signup", element: <SignupPage /> },
        ],
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
          { index: true, element: <HomePage />},
          { path: "sessions", children: [
            {
              element: <SessionsLayout />,
              children: [
                { index: true, element: <Sessions /> },
                { path: ":subjectId", element: <SubjectSessionsPage /> },
                { path: "view/:sessionId", element: <SessionOverlayDetail /> },
              ],
            },
            { path: "new", element: <NewSessionPage /> },
            {
              path: "run/:sessionId",
              element: <SessionLayout />,
              handle: { hideIncompleteBanner: true },
              children: [
                { index: true, element: <SessionRunPage /> },
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
