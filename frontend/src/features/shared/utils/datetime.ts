export const formatDateTime = (iso: string) => {
  const date= new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
};

export const formatRelativeDate = (iso: string, now = new Date()) => {
  const target = new Date(iso);
  if (Number.isNaN(target.getTime())) return iso;

  const diffMs = now.getTime() - target.getTime();
  if (diffMs <= 0) return "0日前";

  const dayMs = 24 * 60 * 60 * 1000;
  const days = Math.floor(diffMs / dayMs);

  // 0~23時間は「N時間前」
  const hours = Math.floor(diffMs / (60 * 60 * 1000));
  if (hours < 24) return `${hours}時間前`;

  // 0〜30日は「N日前」
  if (days < 31) return `${days}日前`;

  // 1〜11ヶ月は「Nヶ月前」(端数切り捨て)
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}ヶ月前`;

  // 1年以上は「N年前」
  const years = Math.floor(days / 365);
  return `${years}年前`;
};