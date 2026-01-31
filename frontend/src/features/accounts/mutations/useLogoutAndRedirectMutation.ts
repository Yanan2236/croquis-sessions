import { useMutation } from "@tanstack/react-query"
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { logout } from "@/features/accounts/api";

export const useLogoutAndRedirectMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      navigate("/auth/login", { replace: true });
    }
  })
}