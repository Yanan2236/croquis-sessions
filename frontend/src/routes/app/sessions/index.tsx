import styles from "./styles.module.css"
import { useSessionsQuery } from "@/features/sessions/queries/useSessionsQuery"
import { SubjectSessionsCard } from "@/routes/app/sessions/components/SubjectSessionsCard"
import { Seo } from "@/components/seo/Seo";

export const Sessions = () => {
  const { data: groups, isLoading, isError } = useSessionsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <>
      <Seo
        title="クロッキー記録"
        description="これまでのクロッキーセッションを一覧で確認できます。練習履歴を振り返り、継続的な上達をサポートします。"
      />
      <section className={styles.page} aria-label="セッション一覧">
        <div className={styles.grid} role="list" aria-label="Subjects">
          {groups!.map((group) => (
            <div key={group.subjectId} className={styles.item} role="listitem">
              <SubjectSessionsCard group={group} />
            </div>
          ))}
        </div>
      </section>
    </>
  );

}
