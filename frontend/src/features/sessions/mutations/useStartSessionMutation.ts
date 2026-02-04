import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { startSession } from "@/features/sessions/api";
import { routes } from "@/lib/routes";


export const useStartSessionMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: startSession,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["incomplete-session"] }); // 未完成セッションキャッシュを更新
      navigate(routes.sessionRun(data.id), { replace: true });
    }
  })
};


