import { SubjectCard } from "@/routes/sessions/new/components/SessionStartWorkspace/SubjectCard";
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
    <section
      className={styles.left}
      aria-label="モチーフ選択"
    >

      <header className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>
          1. モチーフを選ぶ
        </h2>
        <p className={styles.panelHint}>
          クリックして選択してください。
        </p>
      </header>

      <ul
        className={styles.subjectList}
        aria-label="モチーフ一覧"
      >
        {subjects.map((subject) => {
          const isSelected = subject.name === subjectValue;

          return (
            <li
              key={subject.id}
              className={styles.subjectItem}
            >
              <button
                type="button"
                className={`${styles.subjectCard} ${
                  isSelected ? styles.selected : ""
                }`}
                aria-pressed={isSelected}
                onClick={() => {
                  setSubjectValue(subject.name);
                  setIntentionValue(
                    subject.latest_session?.next_action ?? ""
                  );
                }}
              >
                <SubjectCard subject={subject} />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );

};
