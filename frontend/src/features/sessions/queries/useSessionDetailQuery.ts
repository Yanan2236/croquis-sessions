import { useQuery } from "@tanstack/react-query";

import { fetchSessionDetails } from "@/features/sessions/api";

export const useSessionDetailsQuery = (sessionId: number, enabled = true) => {
  return useQuery({
    queryKey: ["session", "details", sessionId],
    queryFn: () => fetchSessionDetails(sessionId),
    enabled,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });
}