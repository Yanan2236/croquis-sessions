import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { fetchSessionDetails } from "@/features/sessions/api";

import styles from "./styles.module.css";

export const SessionFinishedPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();

  const sessionIdNum = useMemo(() => {
    if (!sessionId) return null;
    const n = Number(sessionId);
    return Number.isNaN(n) ? null : n;
  }, [sessionId]);

  const { 
    data: session,
    isPending,
    isError,
    error,
   } = useQuery({
    queryKey: ["session", sessionIdNum],
    queryFn: () => fetchSessionDetails(sessionIdNum!),
    enabled: sessionIdNum !== null,
  });

  if (!sessionId) return <div>Session ID is missing</div>;
  if (sessionIdNum === null) return <div>Session ID is invalid</div>;

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;
  if (!session) return <div>Session not found</div>;

  return (
    <div>
      <h1>おつかれさまでした！</h1>
      <p>{session.duration_seconds}</p>
      <p>{session.subject.name}</p>
      <ul className={styles.previewList}>
        {session.drawings.map((d) => (
          <li key={d.id} className={styles.previewItem}>
            <img
              className={styles.previewImg}
              src={d.image_url}
              alt={`drawing-${d.id}`}
              draggable={false}
              loading="lazy"
            />
          </li>
        ))}
      </ul>
    </div>
  )
};