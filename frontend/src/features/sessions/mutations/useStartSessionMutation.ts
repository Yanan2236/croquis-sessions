import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { UseMutationOptions } from "@tanstack/react-query";

import { startSession } from "@/features/sessions/api";
import { routes } from "@/lib/routes";
import type { CroquisSession, StartSessionPayload } from "../types";


export const useStartSessionMutation = (
  options?: UseMutationOptions<CroquisSession, Error, StartSessionPayload, unknown>
) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { onSuccess, ...rest } = options ?? {};

    return useMutation({
      ...rest,
    mutationFn: startSession,
    onSuccess: (data, variables, context, _mutation) => {
      queryClient.invalidateQueries({ queryKey: ["incomplete-session"] }); // 未完成セッションキャッシュを更新

      onSuccess?.(data, variables, context, _mutation);

      navigate(routes.sessionRun(data.id), { replace: true });
    }
  })
};


