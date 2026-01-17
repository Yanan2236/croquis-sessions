import { useQuery } from "@tanstack/react-query";

import { fetchSubjectsOverview  } from "@/features/subjects/api";
import { SubjectCard } from "@/routes/subjects/components/SubjectCard";
import styles from "./styles.module.css";

export const SubjectsPage = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["subjects"],
    queryFn: fetchSubjectsOverview,
  });

  if (isLoading) return <div>Loading ...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;

  const subjects = data ?? [];

  return (
    <section className={styles.subjectsPage}>
      <header className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Subjects</h2>
      </header>

      <ul className={styles.subjectList}>
        {subjects.map((subject) => {
          return (
            <li key={subject.id} className={styles.subjectItem}>
              <SubjectCard subject={subject} />
            </li>
          );
        })}
      </ul>
    </section>
  );

}