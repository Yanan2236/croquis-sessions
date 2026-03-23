import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

export const NotFound = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <p className={styles.code}>404</p>

        <h1 className={styles.title}>
          ページが見つかりません
        </h1>

        <p className={styles.description}>
          指定されたページは存在しないか、削除された可能性があります。
        </p>

        <div className={styles.actions}>
          <Link to="/" className={styles.primaryButton}>
            ホームへ戻る
          </Link>
        </div>
      </div>
    </div>
  );
};