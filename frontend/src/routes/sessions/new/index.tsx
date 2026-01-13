import { SessionStartForm } from "@/routes/sessions/components/SessionStartForm"
import styles from "./styles.module.css"

export const NewSessionPage = () => {
  return (
    <div className={styles.root}>
      <h1 className={styles.title}>新規セッション作成</h1>
      <SessionStartForm />
    </div>
  )
}