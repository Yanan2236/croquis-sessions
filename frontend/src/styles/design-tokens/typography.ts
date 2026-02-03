export const fontSize = {
  label: "12px",        // メタ・補足
  body: "13px",         // 基本文
  bodyStrong: "14px",   // 入力・強調文
  sectionTitle: "16px", // カード見出し
  pageTitle: "18px",    // ページタイトル
  heroTitle: "20px",    // 画面主見出し
} as const;

export const lineHeight = {
  tight: "1.3",
  normal: "1.55",
  relaxed: "1.7",
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 650,
  bold: 750,
  black: 900,
} as const;
