import { useState, useMemo } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { confirmPasswordReset } from "@/features/accounts/api";

import styles from "./styles.module.css";

export const ResetPasswordPage = () => {
  const [sp] = useSearchParams();
  const navigate = useNavigate();

  const uid = sp.get("uid");
  const token = sp.get("token");
  const hasParams = useMemo(() => Boolean(uid && token), [uid, token]);

  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const mismatch = useMemo(() => {
    if (!newPassword1 || !newPassword2) return false;
    return newPassword1 !== newPassword2;
  }, [newPassword1, newPassword2]);

  const canSubmit = useMemo(() => {
    if (!uid || !token) return false;
    if (!newPassword1 || !newPassword2) return false;
    if (mismatch) return false;
    return status !== "saving";
  }, [uid, token, newPassword1, newPassword2, mismatch, status]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid || !token) return;

    setStatus("saving");
    setMessage("");

    try {
      await confirmPasswordReset(uid, token, newPassword1, newPassword2);
      setStatus("success");
      setMessage("パスワードを更新しました。ログインしてください。");
    } catch (e: any) {
      setStatus("error");
      const msg =
        e?.response?.data?.detail ??
        e?.response?.data?.new_password2?.[0] ??
        "更新に失敗しました。リンクが期限切れかもしれません。";
      setMessage(msg);
      console.log({ uid, token });
      console.log("reset confirm error data:", e?.response?.data);
      console.log("submit payload", {
        uid,
        token,
        new_password1: newPassword1,
        new_password2: newPassword2,
      });
    }
  };

  if (!hasParams) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <header className={styles.header}>
            <h1 className={styles.title}>Reset Password</h1>
            <p className={styles.subtitle}>リンクが無効です</p>
          </header>

          <div className={styles.form}>
            <div className={styles.errorBox} role="alert" aria-live="polite">
              <div className={styles.errorTitle}>再設定できません</div>
              <ul className={styles.errorList}>
                <li>リンクが不完全、または期限切れです。</li>
              </ul>
            </div>

            <div className={styles.footer}>
              <button
                type="button"
                className={styles.linkButton}
                onClick={() => navigate("/auth/forgot-password")}
              >
                再送メールを送る
              </button>
            </div>

            <div className={styles.footer}>
              <Link className={styles.linkAsText} to="/auth/login">
                ログインへ戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Reset Password</h1>
          <p className={styles.subtitle}>新しいパスワードを設定してください</p>
        </header>

        {status === "success" ? (
          <div className={styles.form}>
            <div className={styles.successBox} role="status" aria-live="polite">
              <div className={styles.successTitle}>更新しました</div>
              <p className={styles.successText}>{message}</p>
            </div>

            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => navigate("/auth/login", { replace: true })}
            >
              ログインへ
            </button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={onSubmit}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="new_password1">
                新しいパスワード
              </label>
              <input
                id="new_password1"
                className={styles.input}
                type="password"
                autoComplete="new-password"
                value={newPassword1}
                onChange={(e) => setNewPassword1(e.target.value)}
                placeholder="新しいパスワード"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="new_password2">
                新しいパスワード（確認）
              </label>
              <input
                id="new_password2"
                className={styles.input}
                type="password"
                autoComplete="new-password"
                value={newPassword2}
                onChange={(e) => setNewPassword2(e.target.value)}
                placeholder="もう一度入力"
              />
            </div>

            {mismatch && (
              <div className={styles.errorBox} role="alert" aria-live="polite">
                <div className={styles.errorTitle}>確認用パスワードが一致しません</div>
                <ul className={styles.errorList}>
                  <li>同じパスワードを入力してください。</li>
                </ul>
              </div>
            )}

            {status === "error" && (
              <div className={styles.errorBox} role="alert" aria-live="polite">
                <div className={styles.errorTitle}>更新に失敗しました</div>
                <ul className={styles.errorList}>
                  <li>{message}</li>
                </ul>
              </div>
            )}

            <button
              className={styles.primaryButton}
              type="submit"
              disabled={!canSubmit}
            >
              {status === "saving" ? "Updating..." : "更新する"}
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
  );
};