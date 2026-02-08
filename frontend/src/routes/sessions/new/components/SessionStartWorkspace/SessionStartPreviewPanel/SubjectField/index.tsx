import styles from "../styles.module.css";
import { RequirementBadge } from "@/components/ui/RequirementBadge";

type Props = {
  subjectValue: string;
  intentionValue: string;
  setIntentionValue: (v: string) => void;
};

export const SubjectField = ({
  subjectValue,
  intentionValue,
  setIntentionValue,
}: Props) => {
  return (
    <>
      {/* モチーフ */}
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

      {/* 課題 */}
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

        <p className={styles.helpText}></p>
      </div>
    </>
  );
};
