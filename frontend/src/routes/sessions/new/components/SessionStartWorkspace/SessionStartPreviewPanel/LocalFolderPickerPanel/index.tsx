import styles from "../styles.module.css";
import type { IntervalSec, PickedFileEntry } from "@/features/sessions/run/runSessionStore";
import { RequirementBadge } from "@/components/ui/RequirementBadge";

export type LocalFolderPickerPanelProps = {
  supported: boolean;
  isPicking: boolean;
  dirName: string | null;
  entries: PickedFileEntry[];
  intervalSec: IntervalSec;
  setIntervalSec: (v: IntervalSec) => void;
  onPickFolder: () => void;
};

export const LocalFolderPickerPanel = ({
  supported,
  isPicking,
  dirName,
  entries,
  intervalSec,
  setIntervalSec,
  onPickFolder,
}: LocalFolderPickerPanelProps) => {
  const folderLabel = dirName ?? "クリックしてフォルダを選択";
  const folderTitle = dirName ?? "未選択";
  const fileCount = entries.length;

  return (
    <>
      {/* Folder */}
      <div className={styles.field}>
        <div className={styles.fieldHeader}>
          <span className={styles.fieldLabel}>画像フォルダ</span>
          <RequirementBadge requirement="optional" />
        </div>

        <button
          type="button"
          className={`${styles.fieldValue} ${styles.folderPicker}`}
          onClick={onPickFolder}
          disabled={!supported || isPicking}
          data-empty={fileCount === 0}
          aria-live="polite"
          title={folderTitle}
        >
          {isPicking ? "読み込み中…" : `${folderLabel} ${fileCount === 0 ? "" : `(${fileCount}枚)`}`}
        </button>

        {!supported && (
          <p className={styles.helpText} role="note">
            このブラウザではフォルダ選択に未対応です（Chrome / Edge 推奨）。
          </p>
        )}
      </div>

      {/* Interval */}
      <div className={styles.field}>
        <div className={styles.fieldHeader}>
          <span className={styles.fieldLabel}>インターバル（秒）</span>
          <RequirementBadge requirement="optional" />
        </div>

        <div className={`${styles.fieldValue} ${styles.segmentValue}`} role="group" aria-label="インターバル選択">
          <button
            type="button"
            className={`${styles.localSegBtn} ${intervalSec === 20 ? styles.localSegActive : ""}`}
            onClick={() => setIntervalSec(20)}
            aria-pressed={intervalSec === 20}
          >
            20
          </button>
          <button
            type="button"
            className={`${styles.localSegBtn} ${intervalSec === 30 ? styles.localSegActive : ""}`}
            onClick={() => setIntervalSec(30)}
            aria-pressed={intervalSec === 30}
          >
            30
          </button>
          <button
            type="button"
            className={`${styles.localSegBtn} ${intervalSec === 60 ? styles.localSegActive : ""}`}
            onClick={() => setIntervalSec(60)}
            aria-pressed={intervalSec === 60}
          >
            60
          </button>
          <button
            type="button"
            className={`${styles.localSegBtn} ${intervalSec === 120 ? styles.localSegActive : ""}`}
            onClick={() => setIntervalSec(120)}
            aria-pressed={intervalSec === 120}
          >
            120
          </button>
          <button
            type="button"
            className={`${styles.localSegBtn} ${intervalSec === 180 ? styles.localSegActive : ""}`}
            onClick={() => setIntervalSec(180)}
            aria-pressed={intervalSec === 180}
          >
            180
          </button>
          <button
            type="button"
            className={`${styles.localSegBtn} ${intervalSec === 300 ? styles.localSegActive : ""}`}
            onClick={() => setIntervalSec(300)}
            aria-pressed={intervalSec === 300}
          >
            300
          </button>
        </div>
      </div>
    </>
  );
};
