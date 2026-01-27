import { useMutation } from "@tanstack/react-query"
import { useQueryClient } from "@tanstack/react-query";

import { logout } from "@/features/accounts/api";

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["me"] });
      queryClient.removeQueries({ queryKey: ["incomplete-session"] });
    }
  })
}