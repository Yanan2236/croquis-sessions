import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { finishAll } from "@/features/sessions/api";
import { routes } from "@/lib/routes";
import type { FinishSessionPayload } from "@/features/sessions/types";
import type { FileWithPreview } from "@/features/drawings/types";

import { Dropzone } from "@/routes/sessions/run/$sessionId/finish/components/Dropzone";
import styles from "./styles.module.css";
import { RequirementBadge } from "@/components/ui/RequirementBadge";

type Props = {
  sessionId: number;
  subjectName: string;
  currentIntention: string | null;
};


export const SessionFinishForm = ({ sessionId, subjectName, currentIntention }: Props) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [nextActionValue, setNextActionValue] = useState("");
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  useEffect(() => {
    return () => {
      files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: finishAll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session", sessionId] });
      queryClient.invalidateQueries({ queryKey: ["subjects"]});
      queryClient.setQueryData(["incomplete-session"], null); // 未完成セッションキャッシュを手動クリア
      queryClient.invalidateQueries({queryKey: ["sessions", "list"]});
      navigate(routes.sessionRunDone(sessionId), { replace: true });
    },
    onError: (error: AxiosError) => {
      console.error(error);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: FinishSessionPayload = {
      next_action: nextActionValue.trim() ? nextActionValue.trim() : null,
    };

    mutate({
      sessionId,
      payload,
      files: files.map((f) => f.file),
    });
  };

  return (
    <form className={styles.page} onSubmit={handleSubmit} aria-label="セッション完了フォーム">
      <div className={styles.sheet}>
        <header className={styles.header} aria-label="セッション完了">
          <div className={styles.headerRow}>
            <div className={styles.leftHeader}>
              <p className={styles.kicker}>セッション完了</p>
              <h1 className={styles.title}>{subjectName}</h1>
            </div>
          </div>

          <p className={styles.hint}>
            左で今回を確認し、右で次回の課題を書いて保存します。
          </p>
        </header>

        <section className={styles.main} aria-label="完了内容">
          <div className={styles.topGrid} aria-label="今回の課題と次回の課題">
            <section className={styles.panel} aria-label="今回の課題">
              <header className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>1. 今回の課題</h2>
              </header>

              <div className={styles.card}>
                <div className={styles.field}>
                  <div className={styles.fieldHeader}>
                    <span className={styles.fieldLabel}>今回の課題</span>
                  </div>

                  <div className={styles.readonlyBox} data-empty={!currentIntention}>
                    {currentIntention || "—"}
                  </div>
                </div>
              </div>
            </section>

            <div className={styles.bridge} aria-hidden="true">
              <span className={styles.bridgeTriangle} />
            </div>

            <section className={styles.panel} aria-label="次回の課題">
              <header className={styles.panelHeader}>
                <div className={styles.panelTitleRow}>
                  <h2 className={styles.panelTitle}>2. 次回の課題</h2>
                </div>
              </header>

              <div className={styles.card}>
                <div className={styles.field}>
                  <div className={styles.fieldHeader}>
                    <label className={styles.fieldLabel} htmlFor="nextAction">
                      次回の課題
                    </label>
                    <RequirementBadge requirement="required" />
                  </div>

                  <textarea
                    id="nextAction"
                    className={styles.textarea}
                    value={nextActionValue}
                    onChange={(e) => setNextActionValue(e.target.value)}
                    placeholder="例：最初の10秒で胸郭の向きを取ってから線を引く"
                    rows={5}
                  />
                </div>
              </div>
            </section>
          </div>

          <section className={styles.dropSection} aria-label="画像">
            <header className={styles.panelHeader}>
              <div className={styles.panelTitleRow}>
                <h2 className={styles.panelTitle}>3. 画像</h2>
                <RequirementBadge requirement="optional" />              
              </div>
            </header>


            <div className={styles.dropBody}>
              <Dropzone files={files} setFiles={setFiles} maxFiles={5} />
            </div>
          </section>

          <div className={styles.actions} aria-label="操作">
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={isPending || !nextActionValue.trim()}
            >
              {isPending ? "保存中…" : "保存して完了"}
            </button>
          </div>
        </section>
      </div>
    </form>
  );
};