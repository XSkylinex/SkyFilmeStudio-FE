const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * MINUTES_PER_HOUR;
const PAD_WIDTH = 2;
const PAD_CHARACTER = '0';

export const formatDuration = (seconds: number): string => {
  const total = Math.max(0, Math.round(seconds));
  const hours = Math.floor(total / SECONDS_PER_HOUR);
  const minutes = Math.floor(total / SECONDS_PER_MINUTE) % MINUTES_PER_HOUR;
  const remainder = String(total % SECONDS_PER_MINUTE).padStart(
    PAD_WIDTH,
    PAD_CHARACTER,
  );

  if (hours === 0) {
    return `${String(minutes)}:${remainder}`;
  }

  return `${String(hours)}:${String(minutes).padStart(PAD_WIDTH, PAD_CHARACTER)}:${remainder}`;
};
