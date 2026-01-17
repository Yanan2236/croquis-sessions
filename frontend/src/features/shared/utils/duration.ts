const clampSeconds = (seconds: number) => Math.max(0, Math.floor(seconds));

// N時間（1時間単位、端数切り捨て）
export const formatHoursFloor = (seconds: number) => {
  const s = clampSeconds(seconds);
  const hours = Math.floor(s / 3600);
  return `${hours}時間`;
};

// N分（1分単位、端数切り捨て）
export const formatMinutesFloor = (seconds: number) => {
  const s = clampSeconds(seconds);
  const minutes = Math.floor(s / 60);
  return `${minutes}分`;
};

// H時間M分（端数切り捨て）
export const formatHoursMinutesFloor = (seconds: number) => {
  const s = clampSeconds(seconds);
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  return `${hours}時間${minutes}分`;
};
