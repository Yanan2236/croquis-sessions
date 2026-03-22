import { Link } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import styles from "./styles.module.css";

export const LandingPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <h1 className={styles.title}>LineLoop</h1>

          <p className={styles.catch}>
            クロッキー練習を、積み上げる。
          </p>

          <p className={styles.subtitle}>
            課題を持って描き、記録して、次に活かす。
            <br />
            LineLoop は、クロッキー練習を管理するためのアプリです。
          </p>

          <div className={styles.actions}>
            <Link to="/auth/signup" className={styles.primaryButton}>
              アカウント作成
            </Link>
            <Link to="/auth/login" className={styles.secondaryButton}>
              ログイン
            </Link>
          </div>
        </header>

        <section className={styles.features}>
          <div className={styles.feature}>
            <h2>モチーフ管理</h2>
            <p>
              モチーフごとに課題を設定し、
              セッションごとに更新できます。
            </p>
          </div>

          <div className={styles.feature}>
            <h2>セッション履歴</h2>
            <p>
              練習の記録がモチーフごとに積み上がり、
              改善の流れを残せます。
            </p>
          </div>

          <div className={styles.feature}>
            <h2>タイマー付きクロッキー</h2>
            <p>
              自分で集めた画像フォルダを使って、
              タイマー付きで練習できます。
            </p>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};