import { SubjectCard } from "@/routes/sessions/components/SessionStartForm/SubjectCard";
import type { SubjectOverview } from "@/features/subjects/types";
import styles from "./styles.module.css";

type Props = {
  subjects: SubjectOverview[];
  subjectValue: string;
  setSubjectValue: (v: string) => void;
  setIntentionValue: (v: string) => void;
};

export const SubjectPickerPanel = ({
  subjects,
  subjectValue,
  setSubjectValue,
  setIntentionValue,
}: Props) => {
  return (
    <section className={styles.left} aria-label="Subject picker">
        <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>モチーフを選ぶ</h2>
        <p className={styles.panelHint}>
          クリックして選択してください。
        </p>
      </div>
      
      {/* 一覧（ここは固定） */}
      <ul className={styles.subjectList} aria-label="Subjects list">
        {subjects.map((subject) => (
          <li key={subject.id} className={styles.subjectItem}>
            <button
              type="button"
              className={styles.subjectCard}
              onClick={() => {
                setSubjectValue(subject.name);
                setIntentionValue(subject.latest_session?.next_action ?? "");
              }}
            >
              <SubjectCard subject={subject} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};
