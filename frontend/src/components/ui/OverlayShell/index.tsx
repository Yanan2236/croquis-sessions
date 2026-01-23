import React, { useEffect } from "react";
import styles from "./styles.module.css";

type Props = {
  children: React.ReactNode;
  onClose: () => void;
};

export const OverlayShell = ({ children, onClose }: Props) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        ( document.activeElement as HTMLElement | null )?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className={styles.root} role="dialog" aria-modal="true">
      <button
        type="button"
        className={styles.backdrop}
        onClick={onClose}
        aria-label="Close overlay"
      />

      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};
