import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { endSession } from "@/features/sessions/api";
import { routes } from "@/lib/routes";


export const useRunSessionMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (sessionId: number) => endSession(sessionId),
    onSuccess: (_data, sessionId) => {
      queryClient.invalidateQueries({ queryKey: ["incomplete-session"] });
      queryClient.invalidateQueries({ queryKey: ["sessions", "state", sessionId] });
      navigate(routes.sessionRunFinish(sessionId), { replace: true });
    },
  });
}