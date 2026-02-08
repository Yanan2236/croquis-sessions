import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import { useQueryClient } from "@tanstack/react-query"

import { fetchSubjectsOverview } from "@/features/subjects/api"
import type { StartSessionPayload, IncompleteSessionResponse } from "@/features/sessions/types"
import styles from "./styles.module.css"
import { SubjectPickerPanel } from "@/routes/sessions/new/components/SessionStartWorkspace/SubjectPickerPanel";
import { SessionStartPreviewPanel } from "@/routes/sessions/new/components/SessionStartWorkspace/SessionStartPreviewPanel";
import { useStartSessionMutation } from "@/features/sessions/mutations/useStartSessionMutation";
import type { PickedFileEntry, IntervalSec } from "@/features/sessions/run/runSessionStore";
import * as runSessionStore from "@/features/sessions/run/runSessionStore";

const IMAGE_EXTS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);

/**
 * File System Access APIでフォルダピッカーが使えるかどうかを判定する
 * - 現時点ではChrome系ブラウザ（Chrome / Edge）のみ対応
 * - SSR / Node 環境ではwindowがないのでfalseを返す
 * 
 * @returns フォルダピッカーが使える場合はtrue、そうでなければfalse
 */
const isChromiumDirPickerSupported = (): boolean => {
  return typeof window !== "undefined" && "showDirectoryPicker" in window; 
};

/**
 * ファイル名から拡張子を小文字で取得する
 * 
 * @param filename 
 * @returns 拡張子（小文字）、拡張子がない場合は空文字
 */
const getExtLower = (filename: string): string => {
  const idx = filename.lastIndexOf(".");
  if (idx < 0) return "";
  return filename.slice(idx + 1).toLowerCase();
}

/**
 * フォルダピッカーで選択したディレクトリから画像ファイルを取得する
 * - サブディレクトリは探索しない
 * - ファイル内容は読み込まず、ファイルハンドルのみ取得する（遅延読み込み）
 * 
 * @returns 
 *   dirName: 選択したディレクトリ名
 *   entries: 画像ファイルの一覧（name:名前、ext:拡張子、handle:ファイルハンドル）
 */
const pickImageFilesFromDirectory = async () => {
  if (!isChromiumDirPickerSupported()) {
    throw new Error("このブラウザはフォルダ選択に未対応です");
  }
  // ユーザーが選択したディレクトリのハンドル（ディレクトリへのアクセス権付き参照）を取得
  const dirHandle = await (window as any).showDirectoryPicker() as FileSystemDirectoryHandle;
  const imageEntries: PickedFileEntry[] = [];

  for await (const [name, handle] of (dirHandle as any).entries()) {
    if (handle.kind !== "file") continue;

    const fileHandle = handle as FileSystemFileHandle;

    const ext = getExtLower(name);
    if (!IMAGE_EXTS.has(ext)) continue;

    imageEntries.push({
      name,               // ファイル名           
      handle: fileHandle, // ファイルハンドル
    });
  }
  
  // 画像ファイルをシャッフルして返す
  const shuffle = (array: any[]) => {
    const a = [...array];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const shuffledEntries = shuffle(imageEntries);
  
  return {
    dirName: dirHandle.name, // ディレクトリ名
    entries: shuffledEntries,   // 画像ファイル一覧
  };
}

export const SessionStartForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const startSessionMutation = useStartSessionMutation();

  const [subjectValue, setSubjectValue] = useState("");
  const [intentionValue, setIntentionValue] = useState("");

  /* Local Folder Picker */
  const supported = isChromiumDirPickerSupported();
  const [isPicking, setIsPicking] = useState(false);
  const [dirName, setDirName] = useState<string | null>(null);
  const [entries, setEntries] = useState<PickedFileEntry[]>([]);
  const [intervalSec, setIntervalSec] = useState<IntervalSec>(60);

  const onPickFolder = async () => {
    try {
      setIsPicking(true);

      const result = await pickImageFilesFromDirectory();

      setDirName(result.dirName);
      setEntries(result.entries);

    } finally {
      setIsPicking(false);
    }
  };
  /* ================ */

  const hasIncompleteSession = queryClient.getQueryData<IncompleteSessionResponse | null>(["incomplete-session"]);
  const canStart = !hasIncompleteSession;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["subjects"],
    queryFn: fetchSubjectsOverview,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const localContext = {
      dirName,
      entries,
      intervalSec,
    }

    const payload: StartSessionPayload = {
      subject_name: subjectValue,
      intention: intentionValue,
    };

    startSessionMutation.mutate(payload, {
      onSuccess: (data) => {
        runSessionStore.setRunContext(data.id, localContext);
      },
      onError: (error) => {
        console.error("セッション開始エラー:", error);
      },
    });
  };

  if (isLoading) return <div>Loading ...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;

  const subjects = data ?? [];

  return (
    <section className={styles.workspace}>
      <div className={styles.left}>
        <SubjectPickerPanel
          subjects={subjects}
          subjectValue={subjectValue}
          setSubjectValue={setSubjectValue}
          setIntentionValue={setIntentionValue}
        />
      </div>

      <div className={styles.divider} />

      <div className={styles.right}>
        <SessionStartPreviewPanel
          subjectValue={subjectValue}
          intentionValue={intentionValue}
          setIntentionValue={setIntentionValue}
          isPending={startSessionMutation.isPending}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/", { replace: true })}
          canStart={canStart}

          supported={supported}
          isPicking={isPicking}
          dirName={dirName}
          entries={entries}
          intervalSec={intervalSec}
          setIntervalSec={setIntervalSec}
          onPickFolder={onPickFolder}
        />
      </div>
    </section>
  );
};
