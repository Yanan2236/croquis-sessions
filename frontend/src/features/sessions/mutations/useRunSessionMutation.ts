import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { endSession } from "@/features/sessions/api";
import { routes } from "@/lib/routes";


export const useRunSessionMutation = (sessionId: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => endSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomplete-session"] });
      queryClient.invalidateQueries({ queryKey: ["sessions", "state", sessionId] });
      navigate(routes.sessionRunFinish(sessionId!), { replace: true });
    },
  });
}