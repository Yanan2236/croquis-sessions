import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useMeQuery } from "@/features/accounts/queries/useMeQuery";

export const PublicGuard = () => {
  const location = useLocation();
  const q = useMeQuery();

  const pending = q.status === "pending" || q.fetchStatus === "fetching";
  if (pending) return null;

  const me = q.data ?? null;
  if (me) {
    const fromPath = (location.state as any)?.from?.pathname;
    return <Navigate to={fromPath ?? "/sessions"} replace />;
  }

  return <Outlet />;
};
