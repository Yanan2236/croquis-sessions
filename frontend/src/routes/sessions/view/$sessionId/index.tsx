import { useQuery } from "@tanstack/react-query"
import { useOutletContext } from "react-router-dom"
import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"

import { fetchSessionDetails } from "@/features/sessions/api"
import { formatHoursMinutesFloor } from "@/features/shared/utils/duration"
import styles from "./styles.module.css"




export const SessionOverlayDetail = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const sessionIdNum = Number(sessionId);
  
  const { onClose } = useOutletContext<{ onClose: () => void }>();

  type Mode = "image" | "information";
  const [mode, setMode] = useState<Mode>("image");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { data, isPending } = useQuery({
    queryKey: ["session", sessionIdNum],
    queryFn: () => fetchSessionDetails(sessionIdNum),
    enabled: !isNaN(sessionIdNum),
  });

  const drawings = data?.drawings ?? [];
  const hasMany = drawings.length > 1;

  useEffect(() => {
    if (selectedIndex > drawings.length - 1) {
      setSelectedIndex(0);
    }
  }, [selectedIndex, drawings.length]);

  const selected = drawings[selectedIndex];

  if (isPending) return <div>Loading...</div>;
  if (!data) return <div>Session not found</div>;

  const tabs: Record<Mode, React.ReactNode> = {
    image: (
      <div className={styles.imagePane}>
        <div className={styles.a4Stage}>
          {selected ? (
            <img className={styles.mainImage} src={selected.image_url} alt="" />
          ) : (
            <div className={styles.empty}>No image</div>
          )}

          {hasMany && (
            <div className={styles.thumbBar} aria-label="image picker">
              {drawings.map((d, i) => (
                <button
                  key={d.id}
                  type="button"
                  className={styles.thumbButton}
                  onClick={() => setSelectedIndex(i)}
                  aria-pressed={i === selectedIndex}
                  aria-label={`画像 ${i + 1}/${drawings.length}`}
                  title={`画像 ${i + 1}/${drawings.length}`}
                >
                  <img className={styles.thumbImg} src={d.image_url} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    ),


    information: (
      <div className={styles.infoPane}>
        <h2 className={styles.infoTitle}>セッション情報</h2>

        <dl className={styles.infoList}>
          <div className={styles.infoRow}>
            <dt>モチーフ</dt>
            <dd>{data.subject.name}</dd>
          </div>
          <div className={styles.infoRow}>
            <dt>時間</dt>
            <dd>{formatHoursMinutesFloor(data.duration_seconds)}</dd>
          </div>
          <div className={styles.infoRow}>
            <dt>今回の課題</dt>
            <dd>{data.intention ?? "—"}</dd>
          </div>
          <div className={styles.infoRow}>
            <dt>次回の課題</dt>
            <dd>{data.next_action ?? "—"}</dd>
          </div>
          <div className={styles.infoRow}>
            <dt>振り返り</dt>
            <dd>{data.reflection ?? "—"}</dd>
          </div>
          <div className={styles.infoRow}>
            <dt>ノート</dt>
            <dd>{data.note ?? "—"}</dd>
          </div>
        </dl>
      </div>
    ),
  };

  return (
    <div className={`${styles.detail} ${mode === "image" ? styles.isImage : styles.isInfo}`}>
      <div className={styles.headerRow}>
        <div className={styles.tabBar} role="tablist" aria-label="detail tabs">
          <button
            type="button"
            className={styles.tab}
            aria-selected={mode === "image"}
            onClick={() => setMode("image")}
          >
            画像
          </button>

          <button
            type="button"
            className={styles.tab}
            aria-selected={mode === "information"}
            onClick={() => setMode("information")}
          >
            情報
          </button>
        </div>

        <button type="button" className={styles.closeButton} onClick={onClose}>
          閉じる
        </button>
      </div>

      <div className={styles.stage}>
        <div className={styles.main}>
          {tabs[mode]}
        </div>
      </div>
    </div>
  );
}
