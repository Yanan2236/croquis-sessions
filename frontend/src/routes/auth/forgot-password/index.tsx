import { useState } from "react";
import { requestPasswordReset } from "@/features/accounts/api";
import { useNavigate } from "react-router-dom";

import styles from "./styles.module.css";

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setStatus("sending");

    try {
      await requestPasswordReset(email);
      setStatus("sent");
      setMessage("再設定メールを送信しました。受信箱を確認してください。");
    } catch (e: any) {
      setStatus("error");
      setMessage(e?.response?.data?.detail ?? "送信に失敗しました。");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Reset Password</h1>
          <p className={styles.subtitle}>
            登録したメールアドレスを入力してください
          </p>
        </header>

        <div className={styles.form}>
          {status === "sent" ? (
            <>
              <div className={styles.successBox} role="status">
                <div className={styles.successTitle}>送信しました</div>
                <p className={styles.successMessage}>{message}</p>
              </div>

              <div className={styles.footer}>
                <button
                  type="button"
                  className={styles.linkButton}
                  onClick={() => navigate("/auth/login")}
                >
                  ログインへ戻る
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={onSubmit} className={styles.innerForm}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="email">
                  メールアドレス
                </label>
                <input
                  id="email"
                  className={styles.input}
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="例: lineloop@example.com"
                />
              </div>

              {status === "error" && (
                <div className={styles.errorBox} role="alert" aria-live="polite">
                  <div className={styles.errorTitle}>送信に失敗しました</div>
                  <ul className={styles.errorList}>
                    <li>{message}</li>
                  </ul>
                </div>
              )}

              <button
                className={styles.primaryButton}
                type="submit"
                disabled={status === "sending" || !email}
              >
                {status === "sending" ? "Sending..." : "再設定メールを送る"}
              </button>

              <div className={styles.footer}>
                <button
                  type="button"
                  className={styles.linkButton}
                  onClick={() => navigate("/auth/login")}
                >
                  ログインへ戻る
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};