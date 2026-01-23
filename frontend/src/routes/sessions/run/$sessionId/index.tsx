import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { fetchSessionDetails, endSession } from "@/features/sessions/api";
import { routes } from "@/lib/routes";
import styles from "./styles.module.css";

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
      navigate(routes.sessionRunFinish(sessionIdNum!), { replace: true });
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
    <section className={styles.page} aria-label="セッション実施中">
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.titleBlock}>
            <p className={styles.kicker}>セッション実施中</p>
            <h1 className={styles.subject}>{session.subject.name}</h1>
          </div>

          <button
            type="button"
            className={styles.finishButton}
            onClick={() => mutate(sessionIdNum)}
          >
            終了
          </button>
        </div>

        <div className={styles.timerArea} aria-label="経過時間">
          <div className={styles.timerDigits} aria-live="polite">
            <span className={styles.digit}>00</span>
            <span className={styles.colon} aria-hidden="true">
              :
            </span>
            <span className={styles.digit}>00</span>
          </div>

          <p className={styles.timerMeta}>
            <span className={styles.timerLabel}>経過時間</span>
            <span className={styles.dot} aria-hidden="true">
              ・
            </span>
            <span className={styles.startedAt}>
              開始:{" "}
              <time dateTime={session.started_at}>
                {new Date(session.started_at).toLocaleString()}
              </time>
            </span>
          </p>
          
          <div className={styles.progressTrack} aria-hidden="true">
            <div className={styles.progressFill} />
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.intentionCard} aria-label="今回の課題">
          <h2 className={styles.sectionTitle}>今回の課題</h2>
          <p className={styles.intentionValue}>
            {session.intention ? session.intention : "—"}
          </p>
        </section>
      </main>
    </section>
  );


};