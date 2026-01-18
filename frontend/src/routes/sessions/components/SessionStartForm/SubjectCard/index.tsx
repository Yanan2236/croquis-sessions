import { formatRelativeDate } from "@/features/shared/utils/datetime";
import type { SubjectOverview } from "@/features/subjects/types";

import styles from "./styles.module.css";

type Props = {
  subject: SubjectOverview;
};

export const SubjectCard = ({ subject }: Props) => {
  const latest = subject.latest_session ?? null;

  return (
    <article className={styles.card}>
      <header className={styles.top}>
        <h3 className={styles.title}>{subject.name}</h3>

        {latest ? (
          <time className={styles.latest} dateTime={latest.ended_at}>
            {formatRelativeDate(latest.ended_at)}
          </time>
        ) : (
          <span className={styles.latestMuted}>—</span>
        )}
      </header>

      {latest ? (
        <p className={styles.nextSummary}>
          {latest.next_action}
        </p>
      ) : (
        <p className={styles.empty}>まだセッションがありません</p>
      )}
    </article>
  );
};
