import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { finishAll } from "@/features/sessions/api";
import type { FinishSessionPayload } from "@/features/sessions/types";
import type { FileWithPreview } from "@/features/drawings/types";

import { Dropzone } from "@/routes/sessions/components/Dropzone";
import styles from "./styles.module.css";

type Props = {
  sessionId: number;
  currentIntention: string | null;
};

export const SessionFinishForm = ({ sessionId, currentIntention }: Props) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [reflectionValue, setReflectionValue] = useState("");
  const [nextActionValue, setNextActionValue] = useState("");
  const [noteValue, setNoteValue] = useState("");
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
      queryClient.invalidateQueries({ queryKey: ["subjects"]})
      navigate(`/sessions/${sessionId}/done`, { replace: true });
    },
    onError: (error: AxiosError) => {
      console.error(error);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: FinishSessionPayload = {
      reflection: reflectionValue.trim() ? reflectionValue.trim() : null,
      next_action: nextActionValue.trim() ? nextActionValue.trim() : null,
      note: noteValue.trim() ? noteValue.trim() : null,
    };

    mutate({
      sessionId,
      payload,
      files: files.map((f) => f.file),
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} aria-label="セッション完了フォーム">
      <section className={styles.nextAction} aria-label="次回の課題">
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>次回の課題</h2>
          <span className={styles.requiredBadge} aria-label="必須">必須</span>
        </div>

        <textarea
          className={styles.primaryTextarea}
          value={nextActionValue}
          onChange={(e) => setNextActionValue(e.target.value)}
          placeholder="例：最初の10秒で胸郭の向きを取ってから線を引く"
          rows={3}
        />
      </section>

      <details className={styles.details} aria-label="振り返り">
        <summary className={styles.summary}>
          <span className={styles.summaryTitle}>振り返り</span>
          <span className={styles.optionalBadge} aria-label="任意">任意</span>
        </summary>

        <div className={styles.detailsBody}>
          <textarea
            className={styles.secondaryTextarea}
            value={reflectionValue}
            onChange={(e) => setReflectionValue(e.target.value)}
            placeholder="例：できなかった。原因：輪郭から追って迷った。"
            rows={4}
          />
        </div>
      </details>

      <Dropzone files={files} setFiles={setFiles} maxFiles={5} />

      <div className={styles.footer} aria-label="保存">
        <button type="submit" className={styles.submit} disabled={isPending}>
          {isPending ? "保存中…" : "保存して完了"}
        </button>
      </div>
    </form>
  );
};