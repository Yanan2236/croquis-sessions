import { useQuery } from "@tanstack/react-query";

import { fetchIncompleteSession } from "@/features/sessions/api";

export const useIncompleteSessionQuery = (enabled: boolean) => {
  return useQuery({
    queryKey: ["incomplete-session"],
    queryFn: fetchIncompleteSession,
    enabled,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });
}