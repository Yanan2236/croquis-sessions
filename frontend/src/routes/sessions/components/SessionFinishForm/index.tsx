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
};

export const SessionFinishForm = ({ sessionId }: Props) => {
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
  <form className={styles.form} onSubmit={handleSubmit} aria-label="セッション振り返りフォーム">
    <div className={styles.fields}>
      <label className={styles.field}>
        <span className={styles.label}>振り返り</span>
        <input
          className={styles.input}
          type="text"
          value={reflectionValue}
          onChange={(e) => setReflectionValue(e.target.value)}
          placeholder="例：線が硬かった。肩の力を抜く"
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>次にやること</span>
        <input
          className={styles.input}
          type="text"
          value={nextActionValue}
          onChange={(e) => setNextActionValue(e.target.value)}
          placeholder="例：30秒ポーズで輪郭だけ練習"
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>メモ</span>
        <input
          className={styles.input}
          type="text"
          value={noteValue}
          onChange={(e) => setNoteValue(e.target.value)}
          placeholder="任意（気づいたこと、次回のテーマなど）"
        />
      </label>
    </div>

    <div className={styles.dropzoneBlock}>
      <p className={styles.blockTitle}>画像</p>
      <Dropzone files={files} setFiles={setFiles} maxFiles={5} />
    </div>

    <div className={styles.actions}>
      <button type="submit" className={styles.submit} disabled={isPending}>
        {isPending ? "送信中…" : "保存する"}
      </button>
      <p className={styles.actionHint}>保存後に「おつかれさまでした」画面へ移動します</p>
    </div>
  </form>
);

};
