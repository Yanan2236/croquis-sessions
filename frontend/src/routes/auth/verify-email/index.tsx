import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { api } from "@/lib/api";
import { ensureCsrf } from "@/lib/api/csrf";
import { extractFirstErrorMessage } from "@/features/shared/utils/extractFirstErrorMessage";

type VerifyResult = { detail?: string };

export const VerifyEmailPage = () => {
  const [sp] = useSearchParams();
  const key = sp.get("key");
  const location = useLocation();
  const email = location.state?.email;

  const [status, setStatus] = useState<
    "idle" | "waiting" | "resending" | "verifying" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string>("");

  const hasKey = useMemo(() => Boolean(key), [key]);

  useEffect(() => {
    if (status !== "idle") return;
    setStatus(hasKey ? "verifying" : "waiting");
  }, [hasKey, status]);

useEffect(() => {
  if (!hasKey) return;
  if (status !== "verifying") return;

  const run = async () => {
    try {
      console.log("[verify] start", { key });

      await ensureCsrf();
      console.log("[verify] csrf ok");
    } catch (e: any) {
      console.log("[verify] csrf failed", {
        status: e?.response?.status,
        url: e?.config?.url,
        method: e?.config?.method,
        data: e?.response?.data,
      });
      setMessage("CSRF取得に失敗しました。");
      setStatus("error");
      return;
    }

    try {
      const res = await api.post<VerifyResult>(
        "/api/auth/registration/verify-email/",
        { key }
      );
      console.log("[verify] verify ok", res.data);
      setMessage(res.data?.detail ?? "メール認証が完了しました。");
      setStatus("success");
    } catch (e: any) {
      console.log("[verify] verify failed", {
        status: e?.response?.status,
        url: e?.config?.url,
        method: e?.config?.method,
        data: e?.response?.data,
      });
      setMessage(
        extractFirstErrorMessage(
          e?.response?.data,
          "メール認証に失敗しました。"
        )
      );
      setStatus("error");
    }
  };

  run();
}, [hasKey, key, status]);

  // 認証メール再送
  const resend = async () => {
    if (!email) {
      setMessage("再送するにはメールアドレスが必要です。");
      return;
    }

    try {
      setStatus("resending");
      await ensureCsrf();
      await api.post("/api/auth/registration/resend-email/", { email });
      setMessage("確認メールを再送しました。");
    } catch (e: any) {
      console.log("resend email error data:", e?.response?.data);

      const msg = e?.response?.data?.detail ?? "再送に失敗しました。";
      setMessage(String(msg));
    } finally {
      setStatus("waiting");
    }
  };


  // keyなし：待ち画面
  if (!hasKey) {
    return (
      <div style={{ padding: 16 }}>
        <h1>メール認証</h1>
        <p>
          確認メールを送信しました。受信箱を開いて、メール内のリンクをクリックしてください。
        </p>

        <button type="button" onClick={resend} disabled={status === "resending"}>
          {status === "resending" ? "再送中…" : "確認メールを再送する"}
        </button>

        {message && <p style={{ marginTop: 12 }}>{message}</p>}

        <p style={{ marginTop: 12 }}>
          <Link to="/auth/login">ログインへ</Link>
        </p>
      </div>
    );
  }

  // keyあり：確認処理
  return (
    <div style={{ padding: 16 }}>
      <h1>メール認証</h1>

      {status === "verifying" && <p>確認中…</p>}
      {status === "success" && (
        <>
          <p>{message}</p>
          <p style={{ marginTop: 12 }}>
            <Link to="/auth/login">ログインして始める</Link>
          </p>
        </>
      )}
      {status === "error" && (
        <>
          <p>{message}</p>
          <p style={{ marginTop: 12 }}>
            <Link to="/auth/signup">登録からやり直す</Link>
          </p>
        </>
      )}
    </div>
  );
};
