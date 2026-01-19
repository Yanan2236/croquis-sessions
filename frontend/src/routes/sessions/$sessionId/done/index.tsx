import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { fetchSessionDetails } from "@/features/sessions/api";

import styles from "./styles.module.css";

export const SessionDonePage = () => {
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
  <section className={styles.page} aria-label="セッション完了">
    <header className={styles.header}>
      <p className={styles.kicker}>セッション完了</p>
      <h1 className={styles.title}>おつかれさまでした！</h1>

      <div className={styles.summary} aria-label="セッション概要">
        <div className={styles.summaryItem}>
          <p className={styles.summaryLabel}>モチーフ</p>
          <p className={styles.summaryValue}>{session.subject.name}</p>
        </div>

        <div className={styles.summaryItem}>
          <p className={styles.summaryLabel}>時間</p>
          <p className={styles.summaryValue}>
            {Math.max(1, Math.floor(session.duration_seconds / 60))} 分
          </p>
        </div>

        <div className={styles.summaryItem}>
          <p className={styles.summaryLabel}>枚数</p>
          <p className={styles.summaryValue}>{session.drawings.length} 枚</p>
        </div>
      </div>

      {session.reflection || session.next_action || session.note ? (
        <section className={styles.notesCard} aria-label="記録">
          <h2 className={styles.cardTitle}>振り返り</h2>

          <dl className={styles.notesList}>
            {session.reflection && (
              <div className={styles.notesRow}>
                <dt className={styles.notesLabel}>振り返り</dt>
                <dd className={styles.notesValue}>{session.reflection}</dd>
              </div>
            )}

            {session.next_action && (
              <div className={styles.notesRow}>
                <dt className={styles.notesLabel}>次にやること</dt>
                <dd className={styles.notesValue}>{session.next_action}</dd>
              </div>
            )}

            {session.note && (
              <div className={styles.notesRow}>
                <dt className={styles.notesLabel}>メモ</dt>
                <dd className={styles.notesValue}>{session.note}</dd>
              </div>
            )}
          </dl>
        </section>
      ) : null}
    </header>

    <main className={styles.main}>
      <section className={styles.galleryCard} aria-label="クロッキー">
        <div className={styles.galleryHeader}>
          <h2 className={styles.cardTitle}>クロッキー</h2>
          <p className={styles.galleryHint}>
            {session.drawings.length > 0 ? "" : "画像はありません"}
          </p>
        </div>

        {session.drawings.length > 0 ? (
          <ul className={styles.grid}>
            {session.drawings.map((d) => (
              <li key={d.id} className={styles.item}>
                <img
                  className={styles.img}
                  src={d.image_url}
                  alt={`drawing-${d.id}`}
                  draggable={false}
                  loading="lazy"
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}></p>
          </div>
        )}
      </section>
    </main>

    <footer className={styles.footer}>
      <div className={styles.actions}>
        <button className={styles.primary} type="button">
          一覧へ戻る
        </button>
        <button className={styles.secondary} type="button">
          もう一回描く
        </button>
      </div>
    </footer>
  </section>
);

};