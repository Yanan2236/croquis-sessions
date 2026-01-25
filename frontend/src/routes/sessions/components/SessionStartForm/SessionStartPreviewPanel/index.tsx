import styles from "./styles.module.css";

type Props = {
  subjectValue: string;
  intentionValue: string;
  setIntentionValue: (v: string) => void;
  isPending: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  canStart: boolean;
};

export const SessionStartPreviewPanel = ({
  subjectValue,
  intentionValue,
  setIntentionValue,
  isPending,
  onSubmit,
  onCancel,
  canStart,
}: Props) => {
  return (
    <section className={styles.right} aria-label="Session preview">
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>本日の練習メニュー</h2>
        <p className={styles.panelHint}>
          モチーフを選んで、こだわりポイントを確認・編集してください。
        </p>
      </div>

      <div className={styles.preview}>
        <div className={styles.field}>
          <div className={styles.fieldHeader}>
            <span className={styles.fieldLabel}>モチーフ</span>
            <span className={styles.fieldBadge}>必須</span>
          </div>
          <div className={styles.fieldValue} aria-live="polite">
            {subjectValue ? subjectValue : "未選択"}
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.fieldHeader}>
            <label className={styles.fieldLabel} htmlFor="intention">
              こだわりポイント
            </label>
            <span className={styles.fieldNote}>自動入力</span>
          </div>

          <textarea
            id="intention"
            name="intention"
            value={intentionValue}
            onChange={(e) => setIntentionValue(e.target.value)}
            placeholder="例：輪郭を丁寧に / 比率を崩さない / パース意識"
            rows={5}
            className={styles.textarea}
          />
          <p className={styles.helpText}>
            ※前回の内容が入ります。必要なら直してください。
          </p>
        </div>
      </div>

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
              // 例：トースト表示 / バナーへスクロール / ダイアログ
              alert("未完了のセッションがあるため開始できません。上のバナーから再開してください。");
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
    </section>
  );
};
