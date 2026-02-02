import styles from "./styles.module.css";

type FaceProps = {
  onFlip: () => void;
  onNextImage: () => void;
  onPrevImage?: () => void; // 必要なら
  children: React.ReactNode; // 画像 or 詳細
};

export const FaceShell = ({ onFlip, onNextImage, children }: FaceProps) => {
  return (
    <div className={styles.face}>
      <div className={styles.content}>{children}</div>

      {/* 左：フリップ */}
      <button
        type="button"
        className={styles.hotLeft}
        onClick={onFlip}
        aria-label="詳細を表示/非表示"
      />

      {/* 右：画像切り替え */}
      <button
        type="button"
        className={styles.hotRight}
        onClick={onNextImage}
        aria-label="次の画像"
      >
        <span className={styles.chev} aria-hidden="true"></span>
      </button>
    </div>
  );
};
