import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useLoginMutation } from "@/features/accounts/mutations/useLoginMutation";
import styles from "./styles.module.css";

export const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useLoginMutation();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginMutation.mutate(
      { email, password },
    {
      onSuccess: () => {
        navigate("/sessions", { replace: true });
      }
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Log in</h1>
          <p className={styles.subtitle}>
            アカウントにログインしてください
          </p>
        </header>

        <form className={styles.form} onSubmit={onSubmit}>
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

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              パスワード
            </label>
            <input
              id="password"
              className={styles.input}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワード"
            />
          </div>

          {loginMutation.isError && (
            <div className={styles.errorBox} role="alert" aria-live="polite">
              <div className={styles.errorTitle}>ログインに失敗しました</div>
              <ul className={styles.errorList}>
                <li>メールアドレスまたはパスワードを確認してください。</li>
              </ul>
            </div>
          )}

          <button
            className={styles.primaryButton}
            type="submit"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Logging in..." : "Log In"}
          </button>

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.linkButton}
              onClick={() => navigate("/auth/signup")}
            >
              アカウントを作成する
            </button>
          </div>
        </form>
      </div>
    </div>
  );

};
