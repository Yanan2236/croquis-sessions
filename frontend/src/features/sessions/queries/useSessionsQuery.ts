import { useQuery } from "@tanstack/react-query";
import { listSessions } from "@/features/sessions/api";
import type { ListSessionsParams } from "@/features/sessions/types";

export const useSessionsQuery = (params: ListSessionsParams) => {
  return useQuery({
    queryKey: ["sessions", params.subject ?? "all", params.ordering ?? "-finished_at"],
    queryFn: () => listSessions(params),
  });
};
