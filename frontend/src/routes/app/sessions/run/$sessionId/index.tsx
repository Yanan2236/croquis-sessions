import { useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";

import { fetchSessionDetails } from "@/features/sessions/api";
import styles from "./styles.module.css";
import { useRunSessionMutation } from "@/features/sessions/mutations/useRunSessionMutation";
import * as runSessionStore from "@/features/sessions/run/runSessionStore";

export const SessionRunPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();

  const sessionIdNum = useMemo(() => {
    if (!sessionId) return null;
    const n = Number(sessionId);
    return Number.isNaN(n) ? null : n;
  }, [sessionId]);

  const ctx = runSessionStore.getRunContext(sessionIdNum!);
  const entries = ctx?.entries ?? null;
  const intervalSec = ctx?.intervalSec ?? null;

  const {
    data: session,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["session", sessionIdNum],
    queryFn: () => fetchSessionDetails(sessionIdNum!),
    enabled: sessionIdNum !== null,
  });

  const [nowMs, setNowMs] = useState(() => Date.now());

  const startedAtMs = useMemo(() => {
    if (!session) return null;
    return new Date(session.started_at).getTime();
  }, [session]);

  const timeoutIdRef = useRef<number | null>(null);
  useEffect(() => {
    const tick = () => {
      setNowMs(Date.now());
      timeoutIdRef.current = window.setTimeout(tick, 1000);
    };

    tick();

    return () => {
      if (timeoutIdRef.current !== null) {
        window.clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);
  
  const [src, setSrc] = useState<string | null>(null);
  const elapsedMs = startedAtMs ? nowMs - startedAtMs : null;
  const intervalMs = intervalSec ? intervalSec * 1000 : null;

  const k = entries?.length && elapsedMs !== null && intervalMs != null
    ? Math.floor(elapsedMs / intervalMs)
    : null;

  const index = entries?.length && k !== null
    ? k % entries.length
    : null; 

  const urlRef = useRef<string | null>(null);
  
  useEffect(() => {
    if (!entries?.length) return;
    if (index === null) return;

    let cancelled = false;

    (async () => {
      const entry = entries[index];
      const file = await entry.handle.getFile(); // FileHandle から File オブジェクトを取得
      
      if (cancelled) return;

      const url = URL.createObjectURL(file);     // File オブジェクトからオブジェクトURLを生成

      if (urlRef.current) URL.revokeObjectURL(urlRef.current); // 以前のオブジェクトURLを解放
      urlRef.current = url;

      setSrc(url);                               // 生成したオブジェクトURLを state にセット
    })();

    // effect が破棄される（index 変更 / unmount）直前に呼ばれる。
    return () => {
      cancelled = true;                          // 非同期処理キャンセルフラグを立てる
    };
  }, [entries, index]);

  useEffect(() => {
    return () => {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current); // コンポーネントアンマウント時にオブジェクトURLを解放
      }
      urlRef.current = null;
    };
  }, []);

  const runSessionMutation = useRunSessionMutation();

  const handleSubmit = () => {
    if (sessionIdNum === null) return;

    runSessionMutation.mutate(sessionIdNum, {
      onError: (err) => {
        if (!axios.isAxiosError(err)) return;
        const status = err.response?.status;
        if (status === 409) {
          return;
        }
        console.error(err);
      },
    });
  };

  if (!sessionId) return <div>Session ID is missing</div>;
  if (sessionIdNum === null) return <div>Session ID is invalid</div>;

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;
  if (!session) return <div>Session not found</div>;


  return (
    <section className={styles.page} aria-label="セッション実施中">
      <div className={styles.sheet}>
        <header className={styles.header}>
          <div className={styles.headerRow}>
            <h1 className={styles.subject}>{session.subject.name}</h1>

            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleSubmit}
              disabled={runSessionMutation.isPending}
            >
              終了
            </button>
          </div>
        </header>

        <main className={styles.main}>
          <section className={styles.intentionSection} aria-label="今回の課題">
            <div className={styles.intentionBox} data-empty={!session.intention}>
              {session.intention || "—"}
            </div>
          </section>

          <section className={styles.imageSection} aria-label="参照画像">
            <div className={styles.imageStage}>
              <div className={styles.timerOverlay} aria-label="残り時間">
                <span className={styles.timerValue}>
                  {Math.max(
                    0,
                    Math.floor(
                      ((intervalMs ?? 60000) -
                        ((elapsedMs ?? 0) % (intervalMs ?? 60000))) /
                        1000
                    )
                  )}
                </span>
                <span className={styles.timerUnit}>秒</span>
              </div>

              {src ? (
                <img src={src} alt="クロッキー参照画像" className={styles.image} />
              ) : (
                <div className={styles.imagePlaceholder}>画像がありません</div>
              )}
            </div>
          </section>
        </main>
      </div>
    </section>
  );
};
