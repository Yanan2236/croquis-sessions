import styles from "./styles.module.css";
import type { IntervalSec, PickedFileEntry } from "@/features/sessions/run/runSessionStore";

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
  const folderLabel = dirName ?? "未選択";
  const folderTitle = dirName ?? "未選択";
  const fileCount = entries.length;

  return (
    <section className={styles.page} aria-label="ローカルフォルダからクロッキー参照を開始">
      <header className={styles.header}>
        <p className={styles.kicker}>ローカル参照</p>
        <h1 className={styles.title}>フォルダを選んで開始</h1>
      </header>

      <section className={styles.card} aria-label="設定">
        {/* Folder */}
        <div className={styles.row}>
          <div className={styles.labelBlock}>
            <p className={styles.label}>フォルダ</p>
            <p className={styles.value} title={folderTitle}>
              {folderLabel} ({fileCount}枚)
            </p>
          </div>

          <button
            type="button"
            className={styles.button}
            onClick={onPickFolder}
            disabled={!supported || isPicking}
          >
            {isPicking ? "読み込み中…" : "フォルダを選ぶ"}
          </button>
        </div>

        {/* Interval */}
        <div className={styles.row}>
          <div className={styles.labelBlock}>
            <p className={styles.label}>インターバル</p>
            <p className={styles.value}>切替間隔（秒）</p>
          </div>

          <div className={styles.segment} role="group" aria-label="インターバル選択">
            <button
              type="button"
              className={`${styles.segBtn} ${intervalSec === 60 ? styles.segActive : ""}`}
              onClick={() => setIntervalSec(60)}
              aria-pressed={intervalSec === 60}
            >
              60
            </button>
            <button
              type="button"
              className={`${styles.segBtn} ${intervalSec === 120 ? styles.segActive : ""}`}
              onClick={() => setIntervalSec(120)}
              aria-pressed={intervalSec === 120}
            >
              120
            </button>
          </div>
        </div>
      </section>
    </section>
  );
};
