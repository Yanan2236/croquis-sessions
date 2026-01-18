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

  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const nowDay = startOfDay(now);
  const targetDay = startOfDay(target);

  const diffMs = nowDay.getTime() - targetDay.getTime();
  const dayMs = 24 * 60 * 60 * 1000;

  if (diffMs <= 0) return "今日";

  const days = Math.floor(diffMs / dayMs);

  if (days < 31) return `${days}日前`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}か月前`;

  const years = Math.floor(days / 365);
  return `${years}年前`;
};
