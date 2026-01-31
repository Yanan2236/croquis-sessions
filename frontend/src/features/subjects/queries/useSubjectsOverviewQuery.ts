import { useQuery } from "@tanstack/react-query";

import { fetchSubjectsOverview  } from "@/features/subjects/api";
import { useMeQuery } from "@/features/accounts/queries/useMeQuery";


export const useSubjectsOverviewQuery = () => {
  const meQuery = useMeQuery()
  const userId = meQuery.data?.id

  return useQuery({
    queryKey: ["subjects", "overview", userId],
    queryFn: fetchSubjectsOverview,
    enabled: !!userId,
    staleTime: Infinity,
  });
};