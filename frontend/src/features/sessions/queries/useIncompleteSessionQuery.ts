import { useQuery } from "@tanstack/react-query";

import { fetchIncompleteSession } from "@/features/sessions/api";

export const useIncompleteSessionQuery = () => {
  return useQuery({
    queryKey: ["sessions", "incomplete"],
    queryFn: fetchIncompleteSession,
  });
}