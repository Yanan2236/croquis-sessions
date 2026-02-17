import { useEffect, useRef, useState, useMemo } from "react";
import styles from "./styles.module.css";

import { useSessionDetailsQuery } from "@/features/sessions/queries/useSessionDetailQuery"

type Props = {
  sessionId: number;
  onClose: () => void;
};

export const SessionDetailOverlay = ({ sessionId, onClose }: Props) => {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const { data } = useSessionDetailsQuery(
    sessionId,
    !!sessionId
  );

  const drawings = data?.drawings ?? [];
  const total = drawings.length;

  const [activeIndex, setActiveIndex] = useState(0);

  // セッション切り替え時にインデックスをリセット
  useEffect(() => {
    setActiveIndex(0);
  }, [sessionId]);

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

  const onHeroClick = (e: React.MouseEvent) => {
    if (total === 0) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isLeft = x < rect.width / 2;
    if (isLeft) goPrev();
    else goNext();
  };

  // ESCで閉じる / ←→で切り替え
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.isComposing) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "ArrowLeft") {
        if (total === 0) return;
        e.preventDefault();
        goPrev();
        return;
      }

      if (e.key === "ArrowRight") {
        if (total === 0) return;
        e.preventDefault();
        goNext();
        return;
      }
    };

    window.addEventListener("keydown", onKeyDown, { passive: false } as any);
    return () => window.removeEventListener("keydown", onKeyDown as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, total]);

  // 背景スクロール禁止＆フォーカス移動
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const issueText = useMemo(() => data?.intention?.trim() || "—", [data]);

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section className={styles.modal} role="dialog" aria-modal="true" aria-label="セッション詳細">
        <header className={styles.header} aria-label="課題">
          <p className={styles.issueText}>{issueText}</p>

          <button
            ref={closeBtnRef}
            type="button"
            className={styles.closeCut}
            onClick={onClose}
            aria-label="閉じる"
          >
            ×
          </button>
        </header>

        <div className={styles.viewer} aria-label="画像プレビュー">
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
              <img className={styles.heroImg} src={(hero as any).image_url} alt="" loading="lazy" draggable={false} />
            ) : (
              <div className={styles.heroEmpty}>No image</div>
            )}

            <div className={styles.counter} aria-hidden="true">
              {total ? `${safeIndex + 1} / ${total}` : "0 / 0"}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
