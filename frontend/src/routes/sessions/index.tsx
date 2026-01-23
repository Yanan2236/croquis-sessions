import { useNavigate, useSearchParams } from "react-router-dom"
import { Link } from "react-router-dom"
import { useState } from "react"

import { formatDate, formatRelativeDate } from "@/features/shared/utils/datetime"
import { routes } from "@/lib/routes"
import styles from "./styles.module.css"
import { useSubjectsOverviewQuery } from "@/features/subjects/queries/useSubjectsOverviewQuery"
import { useSessionsQuery } from "@/features/sessions/queries/useSessionsQuery"

export const Sessions = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const subjectId = searchParams.get("subject") ? Number(searchParams.get("subject")) : undefined;
  const ordering = searchParams.get("ordering") ?? "-finished_at";

  const sessionsQuery = useSessionsQuery({
    subject: subjectId,
    ordering: ordering === "finished_at" ? "finished_at" : "-finished_at",
  });

  const subjectsQuery = useSubjectsOverviewQuery();

  const sessions = sessionsQuery.data;
  const subjects = subjectsQuery.data;

  const onChangeSubject = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      
      if (v === "") next.delete("subject");
      else next.set("subject", v);

      return next;
    });
  };

  const onToggleSortOrder = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      const currentOrdering = next.get("ordering") ?? "-finished_at";
      next.set("ordering", currentOrdering === "finished_at" ? "-finished_at" : "finished_at");
      return next;
    });
  };

/* 
  export type SubjectOverview = {
  id: number;
  name: string;
  total_duration_seconds: number;
  latest_session: {
    id: number;
    ended_at: string;
    next_action: string | null;
  };
};
 */

return (
  <div className={styles.page}>
    <header className={styles.header}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Sessions</h1>

        <div className={styles.controls}>
          <div className={styles.selectWrap}>
            <select
              className={styles.select}
              value={subjectId ?? ""}
              onChange={onChangeSubject}
              aria-label="Subject filter"
            >
              <option value="">すべて</option>
              {subjects?.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            <span className={styles.selectChevron} aria-hidden="true">▾</span>
          </div>

          <button type="button" onClick={onToggleSortOrder}>
            {ordering === "finished_at" ? "古い順" : "新しい順"}
          </button>
        </div>
      </div>

      <div className={styles.metaRow}>
        <p className={styles.subtitle}>{sessions?.length ?? 0}件</p>
        <p className={styles.metaRight}>
          {sessionsQuery.isFetching ? "更新中…" : ""}
        </p>
      </div>
    </header>


    {sessionsQuery.isLoading ? (
      <div className={styles.stateBox}>
        <div className={styles.spinner} aria-hidden />
        <p className={styles.stateText}>読み込み中…</p>
      </div>
    ) : sessionsQuery.isError ? (
      <div className={styles.stateBox}>
        <p className={styles.stateTitle}>取得に失敗しました</p>
        <p className={styles.stateText}>
          {sessionsQuery.error instanceof Error ? sessionsQuery.error.message : "Unknown error"}
        </p>
        <button className={styles.button} onClick={() => sessionsQuery.refetch()}>
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