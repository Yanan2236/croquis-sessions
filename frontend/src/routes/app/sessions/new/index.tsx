

import { SessionStartForm } from "@/routes/app/sessions/new/components/SessionStartWorkspace"
import styles from "./styles.module.css"

export const NewSessionPage = () => {
return (
    <div className={styles.root}>
      <SessionStartForm />
    </div>
  )
}