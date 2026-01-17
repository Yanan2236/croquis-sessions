import { formatRelativeDate } from "@/features/shared/utils/datetime";
import { formatHoursFloor } from "@/features/shared/utils/duration";
import type { SubjectOverview } from "@/features/subjects/types";

import styles from "./styles.module.css";

type Props = {
  subject: SubjectOverview;
};

export const SubjectCard = ({ subject }: Props) => {
  const latest = subject.latest_session ?? null;

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <h3 className={styles.title}>{subject.name}</h3>
      </header>

      {latest ? (
        <div className={styles.rows}>
          <div className={styles.row}>
            <span className={styles.label}>合計</span>
            <span className={styles.value}>
              {formatHoursFloor(subject.total_duration_seconds)}
            </span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>最新</span>
            <time className={styles.value} dateTime={latest.ended_at}>
              {formatRelativeDate(latest.ended_at)}
            </time>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>次</span>
            <span className={styles.value}>
              {latest.next_action ? latest.next_action : "未設定"}
            </span>
          </div>
        </div>
      ) : (
        <p className={styles.empty}>まだセッションがありません</p>
      )}
    </article>
  );
};

                  
                  
