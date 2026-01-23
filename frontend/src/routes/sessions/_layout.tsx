import { useOutlet, useNavigate, Outlet, useMatch } from "react-router-dom";

import { Sessions } from "@/routes/sessions";
import { OverlayShell } from "@/components/ui/OverlayShell";

export const SessionsLayout = () => {
  const outlet = useOutlet();
  const navigate = useNavigate();
  const isOverlay = !!useMatch("sessions/view/:sessionId");

  const onClose = () => {
    navigate("/sessions");
  }
  
  return (
    <>


      {isOverlay && (
        <OverlayShell onClose={onClose}>
          <Outlet context={{ onClose }} />
        </OverlayShell>
      )}
      <Sessions />
    </>

  )
};