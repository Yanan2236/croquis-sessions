import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { fetchSessionDetails } from "@/features/sessions/api";
import { RequirementBadge } from "@/components/ui/RequirementBadge";

import styles from "./styles.module.css";

export const SessionDonePage = () => {
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

  if (!sessionId) return <div>Session ID is missing</div>;
  if (sessionIdNum === null) return <div>Session ID is invalid</div>;

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;
  if (!session) return <div>Session not found</div>;

  return (
    <section className={styles.page} aria-label="おつかれさまでした">
      <div className={styles.sheet}>
        <header className={styles.header} aria-label="完了ヘッダー">
          <div className={styles.headerRow}>
            <div className={styles.leftHeader}>
              <p className={styles.kicker}>セッション完了</p>
              <h1 className={styles.title}>おつかれさまでした！</h1>
              <p className={styles.subTitle}>次回の課題は保存されました。</p>
            </div>
          </div>
        </header>

        <main className={styles.main} aria-label="完了内容">
          <section className={styles.panel} aria-label="保存内容">
            <header className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>保存内容</h2>
              <p className={styles.panelHint}>次回の課題と今回の記録を確認できます。</p>
            </header>

            <div className={styles.card}>
              <div className={styles.field} aria-label="次回の課題">
                <div className={styles.fieldHeader}>
                  <span className={styles.fieldLabel}>次回の課題</span>
                  <RequirementBadge requirement="confirmed" />
                </div>

                <div
                  className={styles.readonlyBox}
                  data-empty={!session.next_action}
                >
                  {session.next_action || "—"}
                </div>
              </div>

              <div className={styles.field} aria-label="セッション情報">
                <div className={styles.fieldHeader}>
                  <span className={styles.fieldLabel}>今回の記録</span>
                </div>

                <ul className={styles.metaList} aria-label="メタ情報">
                  <li className={styles.metaItem}>
                    <span className={styles.metaKey}>モチーフ</span>
                    <span className={styles.metaVal}>{session.subject.name}</span>
                  </li>
                  <li className={styles.metaItem}>
                    <span className={styles.metaKey}>時間</span>
                    <span className={styles.metaVal}>
                      {Math.max(1, Math.floor(session.duration_seconds / 60))} 分
                    </span>
                  </li>
                  <li className={styles.metaItem}>
                    <span className={styles.metaKey}>枚数</span>
                    <span className={styles.metaVal}>{session.drawings.length} 枚</span>
                  </li>
                </ul>
              </div>

              <div className={styles.field} aria-label="画像">
                <div className={styles.fieldHeader}>
                  <span className={styles.fieldLabel}>画像</span>
                  <span className={styles.miniMeta}>
                    {session.drawings.length} 枚
                  </span>
                </div>

                {session.drawings.length > 0 ? (
                  <ul className={styles.thumbRow} aria-label="画像サムネイル">
                    {session.drawings.slice(0, 6).map((d) => (
                      <li key={d.id} className={styles.thumbItem}>
                        <img
                          className={styles.thumbImg}
                          src={d.image_url}
                          alt={`drawing-${d.id}`}
                          draggable={false}
                          loading="lazy"
                        />
                      </li>
                    ))}
                    {session.drawings.length > 6 ? (
                      <li className={styles.moreItem} aria-label="残りの画像">
                        <span className={styles.moreText}>
                          +{session.drawings.length - 6}
                        </span>
                      </li>
                    ) : null}
                  </ul>
                ) : (
                  <p className={styles.muted}>画像はありません</p>
                )}
              </div>
            </div>
          </section>

          <div className={styles.actions} aria-label="次の操作">
            <button className={styles.primaryButton} type="button" onClick={() => navigate(`/sessions/new`)}>
              もう一回描く
            </button>
            <button className={styles.secondaryButton} type="button" onClick={() => navigate("/sessions")}>
              一覧へ戻る
            </button>
          </div>
        </main>
      </div>
    </section>
  );
};