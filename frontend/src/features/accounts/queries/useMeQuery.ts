import { useQuery } from "@tanstack/react-query"

import { featchMe } from "@/features/accounts/api"


export const useMeQuery = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => featchMe(),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });
}   