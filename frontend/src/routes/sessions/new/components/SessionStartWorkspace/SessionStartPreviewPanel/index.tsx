import { RequirementBadge } from "@/components/ui/RequirementBadge";
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
    <section className={styles.right} aria-label="今回の練習メニュー">
      <header className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>2. 今回の練習メニュー</h2>
        <p className={styles.panelHint}>
          左でモチーフを選ぶと、内容が反映されます。
        </p>
      </header>

      <div className={styles.preview}>
        {/* Subject */}
        <div className={styles.field}>
          <div className={styles.fieldHeader}>
            <span className={styles.fieldLabel}>モチーフ</span>
            <RequirementBadge requirement="required" />
          </div>

          <div
            className={styles.fieldValue}
            aria-live="polite"
            data-empty={!subjectValue}
          >
            {subjectValue || "未選択"}
          </div>
        </div>

        {/* Intention */}
        <div className={styles.field}>
          <div className={styles.fieldHeader}>
            <label className={styles.fieldLabel} htmlFor="intention">
              今回の課題
            </label>
            <RequirementBadge requirement="optional" />
          </div>

          <textarea
            id="intention"
            name="intention"
            value={intentionValue}
            onChange={(e) => setIntentionValue(e.target.value)}
            placeholder="例：輪郭を丁寧に / 比率を崩さない / パース意識"
            className={styles.textarea}
            readOnly={!subjectValue}
          />

          <p className={styles.helpText}>
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
    </section>
  );

};
