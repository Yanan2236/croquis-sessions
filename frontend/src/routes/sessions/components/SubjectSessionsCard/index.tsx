import { Link } from 'react-router-dom';

import styles from "./styles.module.css";
import { formatRelativeDate } from "@/features/shared/utils/datetime";
import type { GroupBucket } from '@/features/sessions/types';
import { useSessionOverlayParam } from '@/features/sessions/navigation/useSessionOverlayParam';

export const SubjectSessionsCard = ({ group }: { group: GroupBucket }) => {
  const { subjectId, subjectName, items } = group;

  const { open } = useSessionOverlayParam();

  const thumbs = items.slice(0, 4); // 最大4件表示

  return (
    <section className={styles.card} aria-label={`Subject: ${subjectName}`}>
      <Link to={`/sessions/${subjectId}`} className={styles.header}>
        <div className={styles.titleRow}>
          <h2 className={styles.subject}>{subjectName}</h2>
          <span className={styles.count}>{items.length}件</span>
        </div>

        <span className={styles.meta}>
          最終: {formatRelativeDate(items[0].finalized_at)}
        </span>
      </Link>

      <div className={styles.grid} aria-label="セッション">
        {thumbs.map((s) => (
          <button
            key={s.id}
            type="button"
            className={styles.cell}
            onClick={() => open(s.id)}
            aria-label="セッション詳細を開く"
          >
            {s.thumb_image ? (
              <img src={s.thumb_image} alt="" className={styles.img} loading="lazy" />
            ) : (
              <div className={styles.noImage}>No image</div>
            )}
          </button>
        ))}
      </div>
    </section>
  );
};
