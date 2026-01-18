import { SessionStartForm } from "@/routes/sessions/components/SessionStartForm"
import styles from "./styles.module.css"

export const NewSessionPage = () => {
  return (
    <div className={styles.root}>
      <SessionStartForm />
    </div>
  )
}