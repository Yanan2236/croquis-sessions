import { createBrowserRouter, Navigate } from "react-router-dom";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { PublicGuard } from "@/components/auth/PublicGuard";

import { LandingPage } from "@/routes";
import { NotFound } from "@/routes/NotFound";

import { PublicLayout } from "@/routes/auth/PublicLayout";
import { LoginPage } from "@/routes/auth/login";
import { SignupPage } from "@/routes/auth/signup";
import { VerifyEmailPage } from "@/routes/auth/verify-email";
import { ResetPasswordPage } from "@/routes/auth/reset-password";
import { ForgotPasswordPage } from "@/routes/auth/forgot-password";

import { RootLayout } from "@/routes/app/RootLayout";
import { Sessions } from "@/routes/app/sessions";
import { SessionsLayout } from "@/routes/app/sessions/_layout";
import { SubjectSessionsPage } from "@/routes/app/sessions/$subjectId";
import { NewSessionPage } from "@/routes/app/sessions/new";
import { SessionRunPage } from "@/routes/app/sessions/run/$sessionId";
import { SessionFinishPage } from "@/routes/app/sessions/run/$sessionId/finish";
import { SessionDonePage } from "@/routes/app/sessions/run/$sessionId/done";
import { SessionLayout } from "@/routes/app/sessions/run/$sessionId/_layout";
import { SubjectsPage } from "@/routes/app/subjects";

//import { SiteLayout } from "@/routes/SiteLayout";
import { PrivacyPage } from "@/routes/privacy";
import { TermsPage } from "@/routes/terms";
import { ContactPage } from "@/routes/contact";

export const router = createBrowserRouter([
  // Public top
  {
    path: "/",
    //element: <SiteLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "privacy", element: <PrivacyPage /> },
      { path: "terms", element: <TermsPage /> },
      { path: "contact", element: <ContactPage /> },
    ],
  },

  // Public auth
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
          { path: "verify-email", element: <VerifyEmailPage /> },
          { path: "verify-email/:key", element: <VerifyEmailPage /> },
          { path: "forgot-password", element: <ForgotPasswordPage /> },
          { path: "reset-password", element: <ResetPasswordPage /> },
        ],
      },
    ],
  },

  // Private app routes（認証必須）
  {
    path: "/app",
    element: <AuthGuard />,
    children: [
      {
        element: <RootLayout />,
        errorElement: <NotFound />,
        children: [
          { index: true, element: <Navigate to="sessions/new" replace /> },

          {
            path: "sessions",
            children: [
              {
                element: <SessionsLayout />,
                children: [
                  { index: true, element: <Sessions /> },
                  { path: ":subjectId", element: <SubjectSessionsPage /> },
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
            ],
          },

          { path: "subjects", element: <SubjectsPage /> },
          { path: "*", element: <NotFound /> },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);