import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import styles from "./styles.module.css";
import { formatHoursFloor } from "@/features/shared/utils/duration";
import { formatRelativeDate } from "@/features/shared/utils/datetime";
import { renameSubject } from "@/features/subjects/api";
import type { SubjectOverview } from "@/features/subjects/types";

type Props = {
  subject: SubjectOverview;
};

export const SubjectCard = ({ subject }: Props) => {
  const latest = subject.latest_session ?? null;

  const queryClient = useQueryClient();

  const [isRenaming, setIsRenaming] = useState(false);
  const [name, setName] = useState(subject.name);

  const trimmed = name.trim();
  const canSave = trimmed.length > 0 && trimmed !== subject.name;

  const renameMutation = useMutation({
    mutationFn: (newName: string) => renameSubject(subject.id, newName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects", "overview"] });
      setIsRenaming(false);
      setName(subject.name);
    },
    onError: (error: Error) => {
      console.error("Failed to rename subject:", error);
    },
  });

  const startRename = () => {
    setIsRenaming(true);
    setName(subject.name);
  };

  const cancelRename = () => {
    setIsRenaming(false);
    setName(subject.name);
    renameMutation.reset()
  };

  const saveRename = () => {
    if (!canSave || renameMutation.isPending) return;
    renameMutation.mutate(trimmed);
  };

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        {!isRenaming ? (
          <div className={styles.headerRow}>
            <h3 className={styles.title} title={subject.name}>
              {subject.name}
            </h3>

            <button
              type="button"
              className={styles.editButton}
              onClick={startRename}
              aria-label="リネーム"
              title="リネーム"
            >
              ✎
            </button>
          </div>
        ) : (
          <div className={styles.headerRow}>
            <input
              className={styles.nameInput}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") saveRename();
                if (e.key === "Escape") cancelRename();
              }}
            />

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.saveButton}
                onClick={saveRename}
                disabled={!canSave || renameMutation.isPending}
              >
                保存
              </button>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={cancelRename}
                disabled={renameMutation.isPending}
              >
                キャンセル
              </button>
            </div>
          </div>
        )}
      </header>

      <div className={styles.rows}>
        <div className={styles.row}>
          <span className={styles.label}>合計</span>
          <span className={latest ? styles.value : styles.placeholder}>
            {latest ? formatHoursFloor(subject.total_duration_seconds) : "—"}
          </span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>最新</span>
          {latest ? (
            <time className={styles.value} dateTime={latest.finalized_at}>
              {formatRelativeDate(latest.finalized_at)}
            </time>
          ) : (
            <span className={styles.placeholder}>—</span>
          )}
        </div>

        <div className={styles.row}>
          <span className={styles.label}>次</span>
          <span className={latest ? styles.value : styles.placeholder}>
            {latest ? (latest.next_action ? latest.next_action : "未設定") : "—"}
          </span>
        </div>
      </div>

      {renameMutation.isError && (
        <p className={styles.renameError}>更新に失敗しました</p>
      )}
    </article>
  );

};
