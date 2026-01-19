import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { fetchSessionDetails, endSession } from "@/features/sessions/api";

export const SessionDetail = () => {
  const navigate = useNavigate();
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

  const { mutate } = useMutation({
    mutationFn: endSession,
    onSuccess: () => {
      navigate(`/sessions/${sessionIdNum}/finish`, { replace: true });
    },
    onError: (err) => {
      if (!axios.isAxiosError(err)) return;
      const status = err.response?.status;
      if (status === 409) {
        return;
      }
      console.error(err);
    }
  });

  if (!sessionId) return <div>Session ID is missing</div>;
  if (sessionIdNum === null) return <div>Session ID is invalid</div>;

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;
  if (!session) return <div>Session not found</div>;

  return (
    <div>
      <p>{session.subject.name}</p>
      <p>{session.intention}</p>
      <button onClick={() => mutate(sessionIdNum)}>Finish</button>
    </div>
  );
};