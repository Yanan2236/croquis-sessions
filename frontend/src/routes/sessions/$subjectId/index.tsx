import { useParams } from "react-router-dom";
import { useState } from "react";

import { useSessionsQuery } from "@/features/sessions/queries/useSessionsQuery";
import styles from "./styles.module.css";
import { SessionDetailsCard } from "@/routes/sessions/$subjectId/components/SessionDetailsCard";


export const SubjectSessionsPage = () => {
  const [columns, setColumns] = useState(3);
  const { data } = useSessionsQuery();

  const { subjectId } = useParams();
  const subjectIdNum = Number(subjectId);
  if (!Number.isFinite(subjectIdNum)) {
    return <div>不正なIDです</div>;
  }

  const group = data?.find(group => group.subjectId === subjectIdNum);
  if (!group) return <div>データが見つかりません</div>;
 
  return (
    <section
      className={styles.page}
      aria-label={`${group.subjectName}のセッション一覧`}
    >
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>{group.subjectName}</h1>
          <p className={styles.sub}>
            <span className={styles.count}>{group.items.length}件</span>
            <span className={styles.dot} aria-hidden="true">
              ・
            </span>
            <span className={styles.latest}>
              最終:
              {Number.isFinite(group.latestTime)
                ? ` ${new Date(group.latestTime).toLocaleString()}`
                : " —"}
            </span>
          </p>
        </div>
      </header>

      <div
        className={styles.grid}
        style={{ "--cols": columns } as React.CSSProperties}
        role="list"
      >
        {group.items.map((session) => (
          <SessionDetailsCard 
            key={session.id} 
            session={session} 
          />
        ))}
      </div>


      <div className={styles.floatingControls} aria-label="表示列数">
        <div className={styles.viewGroup} role="group">
          <button
            type="button"
            className={styles.viewBtn}
            aria-pressed={columns === 1}
            onClick={() => setColumns(1)}
          >
            1
          </button>
          <button
            type="button"
            className={styles.viewBtn}
            aria-pressed={columns === 2}
            onClick={() => setColumns(2)}
          >
            2
          </button>
          <button
            type="button"
            className={styles.viewBtn}
            aria-pressed={columns === 3}
            onClick={() => setColumns(3)}
          >
            3
          </button>
          <button
            type="button"
            className={styles.viewBtn}
            aria-pressed={columns === 4}
            onClick={() => setColumns(4)}
          >
            4
          </button>
        </div>
      </div>
    </section>
  );
}