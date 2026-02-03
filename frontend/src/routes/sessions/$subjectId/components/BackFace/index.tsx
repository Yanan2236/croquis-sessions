import styles from "./styles.module.css";
import { useSessionDetailsQuery } from "@/features/sessions/queries/useSessionDetailQuery";
import { formatHoursMinutesFloor } from "@/features/shared/utils/duration";
import { formatDateTime } from "@/features/shared/utils/datetime";

type BackFaceProps = {
  setFace: React.Dispatch<React.SetStateAction<"front" | "back">>;
  sessionId: number | string;
};

export const BackFace = ({ setFace, sessionId }: BackFaceProps) => {
  const sessionIdNum =
    typeof sessionId === "number" ? sessionId : Number(sessionId);

  const enabled = Number.isFinite(sessionIdNum);

  const { data, isLoading, isError } = useSessionDetailsQuery(
    sessionIdNum,
    enabled
  );

  const details: any = data ?? null;

return (
  <button
    type="button"
    className={styles.cardButton}
    onClick={() => setFace("front")}
    aria-label="セッションカードに戻る"
  >
    <article className={styles.card} aria-hidden="true">
      <div className={styles.frame}>
        <div className={styles.panel}>
          {!enabled ? (
            <div className={styles.state}>-</div>
          ) : isLoading ? (
            <div className={styles.skeleton}>
              <div className={styles.skelTitle} />
              <div className={styles.skelLine} />
              <div className={styles.skelLine} />
            </div>
          ) : isError ? (
            <div className={styles.state}>-</div>
          ) : (
            <div className={styles.content}>
              <dl className={styles.dl}>
                <div className={styles.row}>
                  <dt className={styles.dt}>課題</dt>
                  <dd className={styles.dd}>
                    {details?.intention ?? "-"}
                  </dd>
                </div>

                <div className={styles.row}>
                  <dt className={styles.dt}>次回の課題</dt>
                  <dd className={styles.dd}>
                    {details?.next_action ?? "-"}
                  </dd>
                </div>

                <div className={styles.row}>
                  <dt className={styles.dt}>練習時間</dt>
                  <dd className={styles.dd}>
                    {typeof details?.duration_seconds === "number"
                      ? formatHoursMinutesFloor(details.duration_seconds)
                      : "-"}
                  </dd>
                </div>

                <div className={styles.row}>
                  <dt className={styles.dt}>日時</dt>
                  <dd className={styles.dd}>
                    {details?.finalized_at
                      ? formatDateTime(details.finalized_at)
                      : details?.ended_at
                      ? formatDateTime(details.ended_at)
                      : details?.started_at
                      ? formatDateTime(details.started_at)
                      : "-"}
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      </div>

      <div className={styles.meta}>
        <span className={styles.metaLeft}>詳細</span>
        <span className={styles.metaRight} aria-hidden="true">
          —
        </span>
      </div>
    </article>
  </button>
);


};
