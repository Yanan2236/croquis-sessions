import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

import { login } from "@/features/accounts/api";

type LoginPayload = {
  email: string;
  password: string;
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload.email, payload.password),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      await queryClient.invalidateQueries({ queryKey: ["incomplete-session"] });
      console.log(queryClient.getQueriesData({ queryKey: ["me"] })); // デバッグ用 必ず消すこと
    },
    onError: (error) => {
      console.error("Login failed:", error);
    }
  });
}