import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useMeQuery } from "@/features/accounts/queries/useMeQuery";

export const AuthGuard = () => {
  const location = useLocation();
  const q = useMeQuery();

  const pending = q.status === "pending" || q.fetchStatus === "fetching";
  if (pending) return null;

  const me = q.data ?? null;

  if (!me) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
};
