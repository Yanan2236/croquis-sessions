import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

import { fetchSessionState } from "@/features/sessions/api";
import { routes } from "@/lib/routes";
import type React from "react";

type Props = {
  children: React.ReactNode;
}

export const SessionRouteGuard = ({ children }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionId } = useParams<{ sessionId: string }>();

  const sessionIdNum = Number(sessionId);
  const enabled = Number.isFinite(sessionIdNum) && sessionIdNum > 0;

  const { data: sessionState, isLoading, isError } = useQuery({
    queryKey: ["sessions", "state", sessionIdNum],
    queryFn: () => fetchSessionState(sessionIdNum),
    enabled,
    staleTime: 0,
  });
  
  useEffect(() => {
    if (!sessionState) return;

    let targetPath: string | null = null;
    switch (sessionState.phase) {
      case "finalized":
        targetPath = routes.sessionRunDone(sessionIdNum);
        break;
      case "ended_unfinalized":
        targetPath = routes.sessionRunFinish(sessionIdNum);
        break;
      case "running":
        targetPath = routes.sessionRun(sessionIdNum);
        break;
      default:
        targetPath = routes.sessionRun(sessionIdNum);
        break;
    }

    if (targetPath && location.pathname !== targetPath) {
      navigate(targetPath, { replace: true });
    }
  }, [sessionState, location.pathname, navigate, sessionIdNum]);

  if (!enabled) return null;
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading session state</div>;

  return <>{children}</>;
}