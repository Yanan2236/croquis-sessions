import { useState } from "react";

import styles from "./styles.module.css";
import { formatHoursFloor } from "@/features/shared/utils/duration";
import { formatRelativeDate } from "@/features/shared/utils/datetime";
import type { SubjectOverview } from "@/features/subjects/types";
import { useRenameSubjectMutation } from "@/features/subjects/mutation/useRenameSubjectMutation";
import { useDeleteSubjectMutation } from "@/features/subjects/mutation/useDeleteSubjectMutation";

type Props = {
  subject: SubjectOverview;
};

export const SubjectCard = ({ subject }: Props) => {
  const latest = subject.latest_session ?? null;

  const [isRenaming, setIsRenaming] = useState(false);
  const [draft, setDraft] = useState("");

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const trimmed = draft.trim();
  const canSave = trimmed.length > 0 && trimmed !== subject.name;

  const renameMutation = useRenameSubjectMutation({
    onSuccess: () => {
      setIsRenaming(false);
      setDraft("");
    },
  });

  const deleteMutation = useDeleteSubjectMutation();

  const confirmDelete = () => {
    if (deleteMutation.isPending) return;

    deleteMutation.mutate(
      { subjectId: subject.id },
      {
        onSettled: () => {
          setIsDeleteOpen(false);
        },
      }
    );
  };

  const startRename = () => {
    setIsRenaming(true);
    setDraft(subject.name);
  };

  const cancelRename = () => {
    setIsRenaming(false);
    setDraft("");
    renameMutation.reset();
  };

  const saveRename = () => {
    if (!canSave || renameMutation.isPending) return;
    renameMutation.mutate({ subjectId: subject.id, newName: trimmed });
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

            <button
              type="button"
              className={styles.deleteButton}
              onClick={() => setIsDeleteOpen(true)}
              aria-label="削除"
              title="削除"
              disabled={deleteMutation.isPending}
            >
              🗑
            </button>
          </div>
        ) : (
          <div className={styles.headerRow}>
            <input
              className={styles.nameInput}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
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

      {isDeleteOpen && (
        <div
          className={styles.deleteOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="削除確認"
          onClick={() => {
            if (!deleteMutation.isPending) setIsDeleteOpen(false);
          }}
        >
          <div
            className={styles.deleteDialog}
            onClick={(e) => e.stopPropagation()}
          >
            <p className={styles.deleteTitle}>削除しますか？</p>
            <p className={styles.deleteMessage}>
              「{subject.name}」を削除します。元に戻せません。
            </p>

            <div className={styles.deleteActions}>
              <button
                type="button"
                className={styles.deleteCancelButton}
                onClick={() => setIsDeleteOpen(false)}
                disabled={deleteMutation.isPending}
              >
                キャンセル
              </button>

              <button
                type="button"
                className={styles.deleteConfirmButton}
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "削除中..." : "削除する"}
              </button>
            </div>

            {deleteMutation.isError && (
              <p className={styles.deleteError}>削除に失敗しました</p>
            )}
          </div>
        </div>
      )}
    </article>
  );
};
