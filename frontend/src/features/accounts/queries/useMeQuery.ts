import { useQuery } from "@tanstack/react-query"

import { fetchMe } from "@/features/accounts/api"


export const useMeQuery = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => fetchMe(),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });
}