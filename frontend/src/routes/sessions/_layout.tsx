import { useNavigate, Outlet, useMatch } from "react-router-dom";

import { Sessions } from "@/routes/sessions";
import { OverlayShell } from "@/components/ui/OverlayShell";

export const SessionsLayout = () => {
  const navigate = useNavigate();
  const isOverlay = !!useMatch("/sessions/view/:sessionId");

  const onClose = () => {
    navigate(-1);
  };

  if (!isOverlay) {
    return <Outlet />;
  }

  return (
    <>
      <Sessions />

      <OverlayShell onClose={onClose}>
        <Outlet context={{ onClose }} />
      </OverlayShell>
    </>
  );
};