import { useQuery } from "@tanstack/react-query";

import { listSessions } from "@/features/sessions/api";
import type { GroupBucket } from "@/features/sessions/types";

export const useSessionsQuery = () => {
  return useQuery({
    queryKey: ["sessions", "list"],
    queryFn: () => listSessions(),
    select: (sessions) => {
      const toTime = (iso: string) => Date.parse(iso);

      const map = new Map<number, GroupBucket>();

      for (const s of sessions!) {
        const subjectId = s.subject.id;
        const t = toTime(s.finalized_at);
        
        if (!map.has(subjectId)) {
          map.set(subjectId, {
            subjectId,
            subjectName: s.subject.name,
            items: [],
            latestTime: t,
          });
        }
        const bucket = map.get(subjectId);
        bucket!.items.push(s);
        if (t > bucket!.latestTime) bucket!.latestTime = t;
      }

      const grouped = Array.from(map.values()).map((bucket) => {
        const sorted = [...bucket.items].sort((a, b) => toTime(b.finalized_at) - toTime(a.finalized_at));

        return { 
          subjectId: bucket.subjectId, 
          subjectName: bucket.subjectName,
          items: sorted, 
          latestTime: bucket.latestTime,
        };
      });

      grouped.sort((a, b) => b.latestTime - a.latestTime); 
      return grouped;
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });
};
