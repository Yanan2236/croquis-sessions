import { useQuery } from "@tanstack/react-query";

import { fetchSubjectsOverview  } from "@/features/subjects/api";


export const useSubjectsOverviewQuery = () => {
  return useQuery({
    queryKey: ["subjects", "overview"],
    queryFn: fetchSubjectsOverview,
    staleTime: Infinity,
  });
};