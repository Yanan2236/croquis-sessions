import { formatRelativeDate } from "@/features/shared/utils/datetime";
import type { SubjectOverview } from "@/features/subjects/types";

import styles from "./styles.module.css";

type Props = {
  subject: SubjectOverview;
};

export const SubjectCard = ({ subject }: Props) => {
  const latest = subject.latest_session ?? null;

  return (
    <article
      className={`${styles.card} ${
        latest ? styles.hasSession : styles.noSession
      }`}
    >
      <header className={styles.top}>
        <h3 className={styles.title}>{subject.name}</h3>

        <time
          className={styles.latest}
          dateTime={latest?.finalized_at}
          aria-hidden={!latest}
        >
          {latest
            ? formatRelativeDate(latest.finalized_at)
            : "NEW!"}
        </time>
      </header>

      <p className={styles.nextSummary}>
        {latest?.next_action || "まだセッションがありません"}
      </p>
    </article>
  );

};
