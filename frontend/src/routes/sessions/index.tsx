import styles from "./styles.module.css"
import { useSessionsQuery } from "@/features/sessions/queries/useSessionsQuery"
import { SubjectSessionsCard } from "@/routes/sessions/components/SubjectSessionsCard"

export const Sessions = () => {
  const { data: groups, isLoading, isError } = useSessionsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <section className={styles.page} aria-label="セッション一覧">
      <div className={styles.grid} role="list" aria-label="Subjects">
        {groups!.map((group) => (
          <div key={group.subjectId} className={styles.item} role="listitem">
            <SubjectSessionsCard group={group} />
          </div>
        ))}
      </div>
    </section>
  );

}
