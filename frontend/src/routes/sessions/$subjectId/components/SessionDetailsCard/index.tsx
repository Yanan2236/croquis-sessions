import { useSearchParams } from "react-router-dom";
import styles from "./styles.module.css";

import { formatMinutesFloor } from "@/features/shared/utils/duration";
import { formatRelativeDate } from "@/features/shared/utils/datetime";
import { useSessionOverlayParam } from "@/features/sessions/navigation/useSessionOverlayParam";

type Props = {
  session: {
    id: number | string;
    thumb_image?: string | null;
    finalized_at: string;
    duration_seconds?: number | null;
  };
};

export const SessionDetailsCard = ({ session }: Props) => {
  const { open } = useSessionOverlayParam();

  const thumb = session.thumb_image ?? null;
  // const durationSeconds = session.duration_seconds ?? 0;
  const finalizedAt = session.finalized_at;

  return (
    <article className={styles.card} role="listitem">
      <button
        type="button"
        className={styles.cardButton}
        onClick={() => open(session.id)}
        aria-label="セッション詳細を表示"
      >
        <div className={styles.inner} aria-hidden="true">
          <div className={styles.frame}>
            <span className={styles.dateBadge}>
              {formatRelativeDate(finalizedAt)}
            </span>

            {thumb ? (
              <img className={styles.thumb} src={thumb} alt="" loading="lazy" />
            ) : (
              <div className={styles.noImage} aria-label="画像なし">
                No image
              </div>
            )}
          </div>
        </div>
      </button>
    </article>
  );
};
