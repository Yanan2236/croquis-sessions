import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { fetchSessionDetails } from '@/features/sessions/api';
import { SessionFinishForm } from '@/routes/sessions/run/$sessionId/finish/components/SessionFinishForm';
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
    <section className={styles.page} aria-label="セッション完了の記録">
      <header className={styles.header}>
        <p className={styles.kicker}>セッション完了</p>
        <h1 className={styles.title}>次回の課題を確定する</h1>
      </header>

      <section className={styles.focusCard} aria-label="課題の確定">
        {/* 今回の課題（コンパクト） */}
        <div className={styles.currentBlock}>
          <p className={styles.currentLabel}>今回の課題</p>

          <div className={styles.currentMetaRow} aria-label="モチーフと時間">
            <span className={styles.currentMetaItem}>
              <span className={styles.currentMetaKey}>モチーフ：</span>
              <span className={styles.currentMetaVal}>{session.subject.name}</span>
            </span>
            <span className={styles.currentMetaSep} aria-hidden="true"> </span>
            <span className={styles.currentMetaItem}>
              <span className={styles.currentMetaKey}>時間：</span>
              <span className={styles.currentMetaVal}>{formatMinutesFloor(session.duration_seconds)}</span>
            </span>
          </div>

          <p className={styles.currentValue}>{session.intention ?? "—"}</p>
        </div>

        <div className={styles.divider} aria-hidden="true" />

        <SessionFinishForm sessionId={sessionIdNum} currentIntention={session.intention} />
      </section>
    </section>
  );

};