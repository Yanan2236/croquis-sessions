import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { Link, Outlet } from "react-router-dom"

import { listSessions } from "@/features/sessions/api"
import { formatDate, formatRelativeDate } from "@/features/shared/utils/datetime"
import { routes } from "@/lib/routes"
import styles from "./styles.module.css"

export const Sessions = () => {
  const navigate = useNavigate();
  const { data, error, isPending, isFetching, isLoading, isError, refetch } = useQuery({
    queryKey: ["sessions"],
    queryFn: () => listSessions(),
  });

  const sessions = data;


return (
  <div className={styles.page}>
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <h1 className={styles.title}>Sessions</h1>
        <p className={styles.subtitle}>
          {(sessions?.length ?? 0)}件{isFetching ? "（更新中…）" : ""}
        </p>
      </div>

      <div className={styles.headerRight}>
        <button className={styles.ghostButton} onClick={() => refetch()}>
          更新
        </button>
      </div>
    </header>

    {isLoading ? (
      <div className={styles.stateBox}>
        <div className={styles.spinner} aria-hidden />
        <p className={styles.stateText}>読み込み中…</p>
      </div>
    ) : isError ? (
      <div className={styles.stateBox}>
        <p className={styles.stateTitle}>取得に失敗しました</p>
        <p className={styles.stateText}>
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
        <button className={styles.button} onClick={() => refetch()}>
          再試行
        </button>
      </div>
    ) : (sessions?.length ?? 0) === 0 ? (
      <div className={styles.stateBox}>
        <p className={styles.stateTitle}>まだセッションがありません</p>
        <p className={styles.stateText}>1回描いたらここが成長ログになる。</p>
      </div>
    ) : (
      <ul className={styles.gallery} aria-label="session gallery">
        {sessions!.map((s) => {
          const thumb = s.drawings?.[0] as any;
          const thumbUrl: string | null =
            (thumb?.image_url as string | undefined) ??
            (thumb?.image_file as string | undefined) ??
            (thumb?.image_file_url as string | undefined) ??
            null;

          const subject = s.subject?.name ?? "Untitled";
          const relative = formatRelativeDate(s.started_at);

          return (
            <li key={s.id} className={styles.tile}>
              <Link to={routes.sessionView(s.id)}>
              <button className={styles.tileButton} type="button">
                <div className={styles.thumb}>
                  {thumbUrl ? (
                    <img
                      className={styles.thumbImg}
                      src={thumbUrl}
                      alt={`${subject} thumbnail`}
                      loading="lazy"
                      draggable={false}
                    />
                  ) : (
                    <div className={styles.noImage} aria-label="no image">
                      <span className={styles.noImageText}>No image</span>
                    </div>
                  )}

                  {/* hover / focus のときだけ下から出る帯 */}
                  <div className={styles.hoverFooter} aria-hidden>
                    <div className={styles.footerLeft}>{subject}</div>
                    <div className={styles.footerRight} title={formatDate(s.started_at)}>
                      {formatRelativeDate(s.started_at)}
                    </div>
                  </div>
                </div>
              </button>
              </Link>
            </li>
          );
        })}
      </ul>  
    )}
  </div>

);
}