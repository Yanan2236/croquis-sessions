import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

import { useSubjectsOverviewQuery } from "@/features/subjects/queries/useSubjectsOverviewQuery";
import { SubjectCard } from "@/routes/subjects/components/SubjectCard";
import styles from "./styles.module.css";
import { createSubject } from "@/features/subjects/api";


export const SubjectsPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useSubjectsOverviewQuery();
  const [subjectName, setSubjectName] = useState("");

  const { mutate } = useMutation({
    mutationFn: () => createSubject(subjectName),
    onSuccess: () => {
      setSubjectName("");
      queryClient.invalidateQueries({ queryKey: ["subjects", "overview"] });
    },
    onError: (error: Error) => {
      console.error("Failed to create subject:", error);
    },
  });

  if (isLoading) return <div>Loading ...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;

  const subjects = data ?? [];

  const handleCreateSubject = async () => {
    if (subjectName.trim() === "") return;
    mutate();
  };

return (
  <section className={styles.subjectsPage}>
    <header className={styles.pageHeader}>
      <h2 className={styles.pageTitle}>Subjects</h2>
    </header>

    <ul className={styles.subjectList}>
      <li className={`${styles.subjectItem} ${styles.newSubjectItem}`}>
        <article className={styles.newSubjectCard}>
          <header className={styles.newSubjectHeader}>
            <h3 className={styles.newSubjectTitle}>新規Subject</h3>
          </header>

          <div className={styles.newSubjectForm}>
            <input
              className={styles.newSubjectInput}
              type="text"
              value={subjectName}
              placeholder="例：肩・胸の練習"
              onChange={(e) => setSubjectName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateSubject();
              }}
            />
            <button
              className={styles.newSubjectButton}
              type="button"
              onClick={handleCreateSubject}
              disabled={!subjectName.trim()}
            >
              作成
            </button>
          </div>

          <p className={styles.newSubjectHint}>
            すぐにセッション開始画面で選べるようになります
          </p>
        </article>
      </li>

      {subjects.map((subject) => (
        <li key={subject.id} className={styles.subjectItem}>
          <SubjectCard subject={subject} />
        </li>
      ))}
    </ul>
  </section>
);
}