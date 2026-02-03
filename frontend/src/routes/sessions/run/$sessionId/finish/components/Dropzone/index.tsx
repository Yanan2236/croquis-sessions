import React, { useRef, useState } from "react";
import styles from "./styles.module.css";

import type { FileWithPreview } from "@/features/drawings/types";

type Props = {
  files: FileWithPreview[];
  setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[]>>;
  accept?: string;      // default: "image/*"
  multiple?: boolean;   // default: true
  maxFiles?: number;    // optional
};

const fileKey = (f: File) => `${f.name}__${f.size}__${f.type}`;

const addFiles = (
  prev: FileWithPreview[],
  incoming: FileList | File[],
  maxFiles?: number
) => {
  console.log("addFiles prev length", prev.length);
  console.log("prev keys", prev.map(x => fileKey(x.file)));
  console.log("incoming keys", Array.from(incoming).map(f => fileKey(f)));

  const prevKeys = new Set(prev.map((x) => fileKey(x.file)));
  const arr = Array.from(incoming);

  console.table(
    arr.map((f) => ({
      name: f.name,
      size: f.size,
      type: f.type,
      lastModified: f.lastModified,
      key: fileKey(f),
    }))
  );

  const next: FileWithPreview[] = [];
  for (const file of arr) {
    if (!file.type.startsWith("image/")) continue;

    const key = fileKey(file);
    if (prevKeys.has(key)) continue;

    if (typeof maxFiles === "number" && prev.length + next.length >= maxFiles) break;

    prevKeys.add(key);
    next.push({ file, previewUrl: URL.createObjectURL(file) });
  }

  return [...prev, ...next];
};

const removeFileByKey = (prev: FileWithPreview[], keyToRemove: string) => {
  const target = prev.find((x) => fileKey(x.file) === keyToRemove);
  if (target) URL.revokeObjectURL(target.previewUrl);
  return prev.filter((x) => fileKey(x.file) !== keyToRemove);
};

export const Dropzone: React.FC<Props> = ({
  files,
  setFiles,
  accept = "image/*",
  multiple = true,
  maxFiles,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const openPicker = () => inputRef.current?.click();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = e.currentTarget.files;
    if (!incoming) return;
    setFiles((prev) => addFiles(prev, incoming, maxFiles));
    e.currentTarget.value = "";
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setFiles((prev) => addFiles(prev, e.dataTransfer.files, maxFiles));
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onRemove = (key: string) => {
    setFiles((prev) => removeFileByKey(prev, key));
  };

  return (
    <div className={styles.wrapper} aria-label="画像追加">
      <div
        className={`${styles.zone} ${isDragging ? styles.dragging : ""}`}
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") openPicker();
        }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
      >

        {files.length === 0 && (
          <div className={styles.center} aria-hidden="true">
            <div className={styles.plus}>＋</div>
            <p className={styles.centerHint}>ドラッグ＆ドロップ</p>
            <p className={styles.centerSub}>クリックして選択もできます</p>
          </div>
        )}

        {files.length > 0 && (
          <ul className={styles.grid} onClick={(e) => e.stopPropagation()} aria-label="追加された画像一覧">
            {files.map((x) => {
              const key = fileKey(x.file);
              return (
                <li key={key} className={styles.item}>
                  <div className={styles.media}>
                    <img className={styles.img} src={x.previewUrl} alt={x.file.name} draggable={false} />
                  </div>

                  <div className={styles.meta}>
                    <p className={styles.name} title={x.file.name}>
                      {x.file.name}
                    </p>
                    <button
                      type="button"
                      className={styles.remove}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(key);
                      }}
                    >
                      削除
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <input
          ref={inputRef}
          className={styles.input}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={onFileChange}
        />
      </div>
    </div>
  );
};
