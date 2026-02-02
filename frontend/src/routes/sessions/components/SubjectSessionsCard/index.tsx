import { Link } from 'react-router-dom';

import styles from "./styles.module.css";
import { formatRelativeDate } from "@/features/shared/utils/datetime";
import type { GroupBucket } from '@/features/sessions/types';

export const SubjectSessionsCard = ({ group }: { group: GroupBucket }) => {
  const { subjectId, subjectName, items } = group;

  const thumbs = items.slice(0, 4); // 最大4件表示

  return (
    <section className={styles.card} aria-label={`Subject: ${subjectName}`}>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h2 className={styles.subject}>{subjectName}</h2>
          <span className={styles.count}>{items.length}件</span>
        </div>

        <div className={styles.metaRow}>
          <span className={styles.meta}>
            最終: {formatRelativeDate(items[0].finalized_at)}
          </span>

          <Link to={`/sessions/${subjectId}`} className={styles.link}>
            全件見る <span aria-hidden="true">{"\u203A"}</span>
          </Link>
        </div>
      </header>

      <div className={styles.grid} aria-label="セッション">
        {thumbs.map((s) => (
          <a key={s.id} href="#" className={styles.cell}>
            {s.thumb_image ? (
              <img
                src={s.thumb_image}
                alt=""
                className={styles.img}
                loading="lazy"
              />
            ) : (
              <div className={styles.noImage}>No image</div>
            )}
          </a>
        ))}
      </div>
    </section>
  );
};
