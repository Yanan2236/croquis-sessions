import styles from "./styles.module.css";
import { useSessionDetailsQuery } from "@/features/sessions/queries/useSessionDetailQuery";

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
                    <dt className={styles.dt}>意図</dt>
                    <dd className={styles.dd}>
                      {details?.intention ? String(details.intention) : "-"}
                    </dd>
                  </div>

                  <div className={styles.row}>
                    <dt className={styles.dt}>次アクション</dt>
                    <dd className={styles.dd}>
                      {details?.next_action ? String(details.next_action) : "-"}
                    </dd>
                  </div>

                  <div className={styles.row}>
                    <dt className={styles.dt}>振り返り</dt>
                    <dd className={styles.dd}>
                      {details?.reflection ? String(details.reflection) : "-"}
                    </dd>
                  </div>

                  <div className={styles.row}>
                    <dt className={styles.dt}>メモ</dt>
                    <dd className={styles.dd}>
                      {details?.note ? String(details.note) : "-"}
                    </dd>
                  </div>

                  <div className={styles.row}>
                    <dt className={styles.dt}>日時</dt>
                    <dd className={styles.dd}>
                      {details?.finalized_at
                        ? new Date(details.finalized_at).toLocaleString()
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
