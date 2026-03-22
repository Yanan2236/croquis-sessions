import { Outlet } from "react-router-dom";

import { SessionRouteGuard } from "@/routes/app/sessions/components/SessionRouteGuard";

export const SessionLayout = () => {
  return (
    <SessionRouteGuard>
      <Outlet />
    </SessionRouteGuard>
  );
};
