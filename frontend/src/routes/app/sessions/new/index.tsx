

import { SessionStartForm } from "@/routes/app/sessions/new/components/SessionStartWorkspace"
import { Seo } from "@/components/seo/Seo";
import styles from "./styles.module.css"

export const NewSessionPage = () => {
return (
    <>
      <Seo
        title="クロッキー開始"
        description="モチーフを選択してクロッキーセッションを開始できます。画像フォルダを使って練習を進められます。"
      />
      <div className={styles.root}>
        <SessionStartForm />
      </div>
    </>
  )
}