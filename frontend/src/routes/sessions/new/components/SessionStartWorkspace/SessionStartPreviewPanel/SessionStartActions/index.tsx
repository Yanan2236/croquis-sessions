import styles from "../styles.module.css";

type Props = {
  subjectValue: string;
  isPending: boolean;
  canStart: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

export const SessionStartActions = ({
  subjectValue,
  isPending,
  canStart,
  onSubmit,
  onCancel,
}: Props) => {
  return (
    <form className={styles.actions} onSubmit={onSubmit}>
      {canStart ? (
        <button
          type="submit"
          className={styles.primaryButton}
          disabled={isPending || !subjectValue}
        >
          {isPending ? "送信中" : "開始"}
        </button>
      ) : (
        <button
          type="button"
          className={`${styles.primaryButton} ${styles.disabledLike}`}
          onClick={() => {
            alert(
              "未完了のセッションがあるため開始できません。上のバナーから再開してください。"
            );
          }}
        >
          未完了のセッションがあるため開始できません
        </button>
      )}

      <button
        type="button"
        className={styles.secondaryButton}
        onClick={onCancel}
        disabled={isPending}
      >
        キャンセル
      </button>
    </form>
  );
};
