import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

export const HomePage = () => {
  const navigate = useNavigate();

  // ダミー
  const goal = "キャラの説得力を上げる";

  const onStart = () => {
    navigate("/sessions/new");
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Home</h1>
          <p className={styles.subtitle}>
            クロッキーは、イラスト上達のための手段
          </p>
        </header>

        <section className={styles.goalSection}>
          <div className={styles.goalLabel}>目標</div>
          <div className={styles.goalText}>{goal}</div>
        </section>

        <button className={styles.primaryButton} type="button" onClick={onStart}>
          セッションを始める
        </button>
      </div>
    </div>
  );
}
