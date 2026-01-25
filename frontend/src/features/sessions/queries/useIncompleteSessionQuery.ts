import { useQuery } from "@tanstack/react-query";

import { fetchIncompleteSession } from "@/features/sessions/api";

export const useIncompleteSessionQuery = () => {
  return useQuery({
    queryKey: ["incomplete-session"],
    queryFn: fetchIncompleteSession,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });
}