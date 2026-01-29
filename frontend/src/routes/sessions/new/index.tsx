

import { SessionStartForm } from "@/routes/sessions/new/components/SessionStartWorkspace"
import styles from "./styles.module.css"

export const NewSessionPage = () => {
return (
    <div className={styles.root}>
      <SessionStartForm />
    </div>
  )
}