import { useEffect, useRef } from "react";
import styles from "./styles.module.css";

import { SessionDetailBody } from "@/features/sessions/components/SessionDetailBody";

type Props = {
  sessionId: number;
  onClose: () => void;
};

export const SessionDetailOverlay = ({ sessionId, onClose }: Props) => {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // ESCで閉じる
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // 背景スクロール禁止＆フォーカス移動
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

return (
  <div
    className={styles.backdrop}
    role="presentation"
    onMouseDown={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}
  >
    <section
      className={styles.modal}
      role="dialog"
      aria-modal="true"
      aria-label="セッション詳細"
    >
      {/* Headerは作らず、閉じるだけ浮かせる */}
      <button
        ref={closeBtnRef}
        type="button"
        className={styles.closeButton}
        onClick={onClose}
        aria-label="閉じる"
      >
        ×
      </button>

      <div className={styles.body}>
        <SessionDetailBody sessionId={sessionId} />
      </div>
    </section>
  </div>
);
};
