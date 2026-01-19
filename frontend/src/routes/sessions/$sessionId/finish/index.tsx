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
  <section className={styles.page} aria-label="セッションを終了して記録する">
    <header className={styles.header}>
      <p className={styles.kicker}>セッション終了</p>
      <h1 className={styles.title}>振り返り</h1>
    </header>

    <div className={styles.grid}>
      <section className={styles.summaryCard} aria-label="セッション概要">
        <h2 className={styles.cardTitle}>今回のセッション</h2>

        <dl className={styles.summaryList}>
          <div className={styles.summaryRow}>
            <dt className={styles.summaryLabel}>モチーフ</dt>
            <dd className={styles.summaryValue}>{session.subject.name}</dd>
          </div>

          <div className={styles.summaryRow}>
            <dt className={styles.summaryLabel}>課題</dt>
            <dd className={styles.summaryValue}>
              {session.intention ? session.intention : "—"}
            </dd>
          </div>

          <div className={styles.summaryRow}>
            <dt className={styles.summaryLabel}>時間</dt>
            <dd className={styles.summaryValue}>
              {formatMinutesFloor(session.duration_seconds)} 分
            </dd>
          </div>
        </dl>

        <p className={styles.summaryHint}>
          ※ 画像は任意。振り返りだけでも保存できます。
        </p>
      </section>

      <section className={styles.formCard} aria-label="振り返り入力">
        <h2 className={styles.cardTitle}>振り返りを残す</h2>
        <SessionFinishForm sessionId={sessionIdNum} />
      </section>
    </div>
  </section>
);

};