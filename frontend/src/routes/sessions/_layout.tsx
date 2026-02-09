import { Outlet } from "react-router-dom";

import { OverlayShell } from "@/components/ui/OverlayShell";
import { useSessionOverlayParam } from "@/features/sessions/navigation/useSessionOverlayParam";
import { SessionDetailOverlay } from "@/features/sessions/overlays/SessionDetailOverlay";

export const SessionsLayout = () => {
  const { viewSessionId, close } = useSessionOverlayParam();

  return (
    <>
      <Outlet />

      {viewSessionId && (
        <OverlayShell onClose={close}>
          <SessionDetailOverlay sessionId={viewSessionId} onClose={close} />
        </OverlayShell>
      )}
    </>
  );
};