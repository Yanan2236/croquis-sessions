import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { fetchSessionDetails } from '@/features/sessions/api';
import { SessionFinishForm } from '@/routes/sessions/components/SessionFinishForm';
import { formatMinutesFloor } from '@/features/shared/utils/duration';
import styles from './styles.module.css';

export const SessionFinishPage = () => {
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
    queryKey: ["session", sessionIdNum] as const,
    queryFn: () => fetchSessionDetails(sessionIdNum!),
    enabled: sessionIdNum !== null,
  });

  
  if (!sessionId) return <div>Session ID is missing</div>;
  if (sessionIdNum === null) return <div>Session ID is invalid</div>;

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;
  if (!session) return <div>Session not found</div>;

  return (
    <>
    <div>Finish</div>
    <p>{session.subject.name}</p>
    <p>{session.intention}</p>
    <p>{formatMinutesFloor(session.duration_seconds)}</p>
    <SessionFinishForm sessionId={sessionIdNum} />
    </>
  )
};