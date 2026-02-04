import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";

import { fetchSessionDetails } from "@/features/sessions/api";
import styles from "./styles.module.css";
import { useRunSessionMutation } from "@/features/sessions/mutations/useRunSessionMutation";

export const SessionRunPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();

  const [nowMs, setNowMs] = useState(() => Date.now());

  const sessionIdNum = useMemo(() => {
    if (!sessionId) return null;
    const n = Number(sessionId);
    return Number.isNaN(n) ? null : n;
  }, [sessionId]);

  const runSessionMutation = useRunSessionMutation(sessionIdNum!);

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

  useEffect(() => {
    const id = window.setInterval(() => {
      setNowMs(Date.now());
    }, 10000);
    return () => window.clearInterval(id);
  }, []);

  const handleSubmit = () => {
    runSessionMutation.mutate(
      undefined,
      {
        onError: (err) => {
          if (!axios.isAxiosError(err)) return;
          const status = err.response?.status;
          if (status === 409) {
            return;
          }
          console.error(err);
        }
      },
    );
  };

  if (!sessionId) return <div>Session ID is missing</div>;
  if (sessionIdNum === null) return <div>Session ID is invalid</div>;

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;
  if (!session) return <div>Session not found</div>;

  const startedAt = new Date(session.started_at).getTime();
  const elapsedMinutes = Math.max(1, Math.floor((nowMs - startedAt) / 60000));

  return (
    <section className={styles.page} aria-label="セッション実施中">
      <div className={styles.sheet}>
        <header className={styles.header}>
          <div className={styles.headerRow}>
            <div className={styles.left}>
              <div className={styles.stateRow} aria-label="状態">
                <span className={styles.stateDot} aria-hidden="true" />
                <span className={styles.stateText}>セッション実施中</span>
              </div>

              <h1 className={styles.subject}>{session.subject.name}</h1>
            </div>

            <div className={styles.right}>
              <div className={styles.timerChip} aria-label="経過時間">
                <span className={styles.timerNum}>{elapsedMinutes}</span>
                <span className={styles.timerUnit}>分</span>
              </div>

              <button
                type="button"
                className={styles.primaryButton}
                onClick={() => handleSubmit()}
                disabled={runSessionMutation.isPending}
              >
                終了
              </button>
            </div>
          </div>
        </header>

        <main className={styles.main}>
          <section className={styles.card} aria-label="今回の課題">
            <div className={styles.field}>
              <div className={styles.fieldHeader}>
                <span className={styles.fieldLabel}>今回の課題</span>
              </div>

              <div className={styles.readonlyBox} data-empty={!session.intention}>
                {session.intention || "—"}
              </div>
            </div>
          </section>
        </main>
      </div>
    </section>
  );
};
