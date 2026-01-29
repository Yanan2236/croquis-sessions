import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

import { fetchSessionDetails, endSession } from "@/features/sessions/api";
import { routes } from "@/lib/routes";
import styles from "./styles.module.css";

export const SessionDetail = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient()
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
      queryClient.invalidateQueries({ queryKey: ["incomplete-session"] });
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
      <div className={styles.headerRow}>
        <div className={styles.left}>
          <div className={styles.stateRow} aria-label="状態">
            <span className={styles.stateDot} aria-hidden="true" />
            <span className={styles.stateText}>セッション実施中</span>
          </div>

          <h1 className={styles.subject}>{session.subject.name}</h1>
        </div>
      </div>

      <div className={styles.timer} aria-label="経過時間">
        <div className={styles.timerDigits} aria-live="polite">
          <span className={styles.digit}>00</span>
          <span className={styles.colon} aria-hidden="true">
            :
          </span>
          <span className={styles.digit}>00</span>
        </div>
      </div>
    </header>

    <main className={styles.main}>
      <section className={styles.card} aria-label="今回の課題">
        <h2 className={styles.sectionTitle}>今回の課題</h2>
        <p
          className={styles.intentionValue}
          data-empty={!session.intention ? "true" : "false"}
        >
          {session.intention ? session.intention : "—"}
        </p>
      </section>

      {/* 下部固定：見ない画面でも「終われる」だけは保証する */}
      <div className={styles.actionBar} aria-label="操作">
        <button
          type="button"
          className={styles.primaryButton}
          onClick={() => mutate(sessionIdNum)}
        >
          終了
        </button>
      </div>
    </main>
  </section>
);

};