import styles from "./styles.module.css";
import { formatMinutesFloor } from "@/features/shared/utils/duration";
import { formatRelativeDate } from "@/features/shared/utils/datetime";

type Face = "front" | "back";

type Session = {
  id: number | string;
  thumb_image?: string | null;
  finalized_at: string;
  duration_seconds?: number | null;
};

type FrontFaceProps = {
  setFace: React.Dispatch<React.SetStateAction<Face>>;
  session: Session;
};

export const FrontFace = ({ setFace, session }: FrontFaceProps) => {
  const thumb = session.thumb_image ?? null;
  const durationSeconds = session.duration_seconds ?? 0;
  const finalizedAt = session.finalized_at;

  return (
    <button
      type="button"
      className={styles.cardButton}
      onClick={() => setFace("back")}
      aria-label="セッション詳細を表示"
    >
      <article className={styles.card} aria-hidden="true">
        <div className={styles.frame}>
          {thumb ? (
            <img className={styles.thumb} src={thumb} alt="" loading="lazy" />
          ) : (
            <div className={styles.noImage} aria-label="画像なし">
              No image
            </div>
          )}
        </div>

        <div className={styles.meta}>
          <span className={styles.metaLeft}>{formatRelativeDate(finalizedAt)}</span>
          <span className={styles.metaRight}>{formatMinutesFloor(durationSeconds)}</span>
        </div>
      </article>
    </button>
  );
};
