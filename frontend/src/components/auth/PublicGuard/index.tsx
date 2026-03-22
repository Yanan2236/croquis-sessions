import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useMeQuery } from "@/features/accounts/queries/useMeQuery";

type RedirectLocation = {
  pathname?: string;
  search?: string;
  hash?: string;
};

export const PublicGuard = () => {
  const location = useLocation();
  const q = useMeQuery();

  const pending = q.status === "pending" || q.fetchStatus === "fetching";
  if (pending) return null;

  const me = q.data ?? null;

  if (me) {
    const from = (location.state as { from?: RedirectLocation } | null)?.from;

    const redirectTo =
      from && from.pathname && from.pathname.startsWith("/app")
        ? `${from.pathname}${from.search ?? ""}${from.hash ?? ""}`
        : "/app/sessions/new";

    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};