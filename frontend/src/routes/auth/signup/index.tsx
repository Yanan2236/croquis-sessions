import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSignupMutation } from "@/features/accounts/mutations/useSignupMutation";
import { classifySignupError, extractValidationMessages } from "@/features/accounts/errors";
import styles from "./styles.module.css";


export const SignupPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [formError, setFormError] = useState<string[]>([]);
  const [username, setUsername] = useState("");

  const signupMutation = useSignupMutation();

  const isConfirmed = () => {
    if (passwordConfirm === "") {
      return true;
    }
    return password === passwordConfirm;
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const payload = {
      username,
      email,
      password,
      password_confirm: passwordConfirm,
    }
    e.preventDefault();
    signupMutation.mutate(
      payload,
    {
      onSuccess: () => {
        navigate("/sessions", { replace: true });
      },
      onError: (error) => {
        const info = classifySignupError(error);

        switch (info.kind) {
          case "bad_request": {
            const messages = extractValidationMessages(info.data);

            setFormError(
              messages.length
                ? messages
                : ["入力内容を確認してください。"]
            );
            return;
          } case "unauthorized":
            setFormError(["認証に失敗しました。もう一度お試しください。"]); 
            break;
          case "conflict":
            setFormError(["このメールアドレスは既に登録されています。"]);
            break;
          case "network":
            setFormError(["通信に失敗しました。ネットワークを確認してください。"]);
            break;
          default:
            setFormError(["エラーが発生しました。時間をおいて再度お試しください。"]);
            break;
        }
      }
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Sign up</h1>
          <p className={styles.subtitle}>
            アカウントを作成してセッションを始めよう
          </p>
        </header>

        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="username">
              ユーザー名
            </label>
            <input
              id="username"
              className={styles.input}
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="例: lineloop_user"
            />
          </div>

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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8文字以上・英数字混在"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="passwordConfirm">
              パスワード確認
            </label>
            <input
              id="passwordConfirm"
              className={styles.input}
              type="password"
              autoComplete="new-password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="もう一度入力"
            />
            {!isConfirmed() && (
              <p className={styles.inlineError}>パスワードが一致しません</p>
            )}
          </div>

          {formError.length > 0 && (
            <div className={styles.errorBox} role="alert" aria-live="polite">
              <div className={styles.errorTitle}>入力を確認してください</div>
              <ul className={styles.errorList}>
                {formError.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            className={styles.primaryButton}
            type="submit"
            disabled={!isConfirmed() || signupMutation.isPending}
          >
            {signupMutation.isPending ? "Signing up..." : "Sign Up"}
          </button>

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.linkButton}
              onClick={() => navigate("/login")}
            >
              すでにアカウントがある？ログインへ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};