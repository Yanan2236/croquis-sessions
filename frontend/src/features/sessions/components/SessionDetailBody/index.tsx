import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useSessionDetailsQuery } from "@/features/sessions/queries/useSessionDetailQuery";

type Props = {
  sessionId: number;
};

export const SessionDetailBody = ({ sessionId }: Props) => {
  const { data, isPending, isError } = useSessionDetailsQuery(sessionId, !!sessionId);
  const [activeIndex, setActiveIndex] = useState(0);

  const drawings = data?.drawings ?? [];
  const total = drawings.length;

  const safeIndex = total === 0 ? 0 : Math.min(activeIndex, total - 1);
  const hero = total ? drawings[safeIndex] : null;

  const goPrev = () => {
    if (total === 0) return;
    setActiveIndex((i) => (i - 1 + total) % total);
  };

  const goNext = () => {
    if (total === 0) return;
    setActiveIndex((i) => (i + 1) % total);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKeyDown, { passive: false } as any);
    return () => window.removeEventListener("keydown", onKeyDown as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  const onHeroClick = (e: React.MouseEvent) => {
    if (total === 0) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isLeft = x < rect.width / 2;
    if (isLeft) goPrev();
    else goNext();
  };

  if (isPending) return <div className={styles.state}>読み込み中…</div>;
  if (isError || !data) return <div className={styles.state}>取得できませんでした</div>;

  return (
    <div className={styles.wrap}>
      <section className={styles.issueBar} aria-label="課題">
        <p className={styles.issueText}>{data.intention?.trim() || "—"}</p>
      </section>

      <section className={styles.heroSection} aria-label="画像プレビュー">
        <div
          className={styles.heroFrame}
          role={total > 0 ? "button" : undefined}
          tabIndex={total > 0 ? 0 : undefined}
          onClick={onHeroClick}
          aria-label={
            total > 0
              ? `画像プレビュー。左半分で前、右半分で次。現在 ${safeIndex + 1} / ${total}`
              : "画像プレビュー"
          }
        >
          {hero ? (
            <img
              className={styles.heroImg}
              src={(hero as any).image_url}
              alt=""
              loading="lazy"
            />
          ) : (
            <div className={styles.heroEmpty}>No image</div>
          )}

          <div className={styles.counter} aria-hidden="true">
            {total ? `${safeIndex + 1} / ${total}` : "0 / 0"}
          </div>

          {total > 0 ? (
            <>
              <div className={styles.hintLeft} aria-hidden="true">
                ← 前
              </div>
              <div className={styles.hintRight} aria-hidden="true">
                次 →
              </div>
            </>
          ) : null}
        </div>

        {total > 0 ? (
          <p className={styles.keyHint}>← → でも切り替え</p>
        ) : null}
      </section>
    </div>
  );
};
