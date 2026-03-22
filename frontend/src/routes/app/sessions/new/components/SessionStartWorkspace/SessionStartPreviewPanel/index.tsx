import styles from "./styles.module.css";
import { SubjectField } from "./SubjectField";
import { SessionStartActions } from "./SessionStartActions";
import { LocalFolderPickerPanel } from "./LocalFolderPickerPanel";
import type { IntervalSec, PickedFileEntry } from "@/features/sessions/run/runSessionStore";

type Props = {
  subjectValue: string;
  intentionValue: string;
  setIntentionValue: (v: string) => void;
  isPending: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  canStart: boolean;

  supported: boolean;
  isPicking: boolean;
  dirName: string | null;
  entries: PickedFileEntry[];
  intervalSec: IntervalSec;
  setIntervalSec: (v: IntervalSec) => void;
  onPickFolder: () => void;
};

export const SessionStartPreviewPanel = ({
  subjectValue,
  intentionValue,
  setIntentionValue,
  isPending,
  onSubmit,
  onCancel,
  canStart,
  supported,
  isPicking,
  dirName,
  entries,
  intervalSec,
  setIntervalSec,
  onPickFolder,
}: Props) => {
  return (
    <section className={styles.right} aria-label="今回の練習メニュー">
      <header className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>2. 今回の練習メニュー</h2>
        <p className={styles.panelHint}>
          左でモチーフを選ぶと、内容が反映されます。
        </p>
      </header>

      <div className={styles.preview}>
        <SubjectField
          subjectValue={subjectValue}
          intentionValue={intentionValue}
          setIntentionValue={setIntentionValue}
        />

        <LocalFolderPickerPanel 
          supported={supported}
          isPicking={isPicking}
          dirName={dirName}
          entries={entries}
          intervalSec={intervalSec}
          setIntervalSec={setIntervalSec}
          onPickFolder={onPickFolder}
        />
      </div>

      <SessionStartActions
        subjectValue={subjectValue}
        isPending={isPending}
        onSubmit={onSubmit}
        onCancel={onCancel}
        canStart={canStart}
      />
    </section>
  );
};
