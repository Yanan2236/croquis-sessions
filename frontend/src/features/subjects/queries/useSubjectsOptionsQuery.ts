import { useQuery } from "@tanstack/react-query";

import { fetchSubjectOptions } from "@/features/subjects/api";


export const useSubjectsOptionsQuery = () => {
  return useQuery({
    queryKey: ["subjects", "options"],
    queryFn: fetchSubjectOptions,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });
};