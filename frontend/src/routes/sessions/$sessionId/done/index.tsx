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
    <section className={styles.page} aria-label="おつかれさまでした">
      <header className={styles.header}>
        <p className={styles.kicker}>セッション完了</p>
        <h1 className={styles.title}>おつかれさまでした！</h1>
        <p className={styles.subTitle}>次回の課題は保存されました。</p>
      </header>

      <main className={styles.main}>
        <section className={styles.heroCard} aria-label="次回の課題">
          <div className={styles.heroHead}>
            <h2 className={styles.heroTitle}>次回の課題</h2>
            <span className={styles.badge} aria-label="確定">確定</span>
          </div>

          <p className={styles.heroValue}>
            {session.next_action ? session.next_action : "—"}
          </p>

          <div className={styles.metaRow} aria-label="セッション情報">
            <span className={styles.metaItem}>
              <span className={styles.metaKey}>モチーフ：</span>
              <span className={styles.metaVal}>{session.subject.name}</span>
            </span>
            <span className={styles.metaItem}>
              <span className={styles.metaKey}>時間：</span>
              <span className={styles.metaVal}>
                {Math.max(1, Math.floor(session.duration_seconds / 60))} 分
              </span>
            </span>
            <span className={styles.metaItem}>
              <span className={styles.metaKey}>枚数：</span>
              <span className={styles.metaVal}>{session.drawings.length} 枚</span>
            </span>
          </div>
        </section>

        {session.reflection ? (
          <section className={styles.card} aria-label="振り返り">
            <div className={styles.cardHead}>
              <h2 className={styles.cardTitle}>振り返り</h2>
              <span className={styles.optionalBadge} aria-label="任意">任意</span>
            </div>
            <p className={styles.text}>{session.reflection}</p>
          </section>
        ) : null}

        <details className={styles.details} aria-label="画像一覧">
          <summary className={styles.summary}>
            <span className={styles.summaryTitle}>クロッキー画像</span>
            <span className={styles.summaryCount}>{session.drawings.length} 枚</span>
          </summary>

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
            <p className={styles.muted}>画像はありません</p>
          )}
        </details>

        <section className={styles.actionsCard} aria-label="次の操作">
          <button className={styles.primary} type="button">
            もう一回描く
          </button>
          <button className={styles.secondary} type="button">
            一覧へ戻る
          </button>
        </section>
      </main>
    </section>
  );
};