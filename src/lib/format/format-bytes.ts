const BYTE_UNITS = ['B', 'kB', 'MB', 'GB', 'TB', 'PB'];
const UNIT_STEP = 1000;
const SCALED_FRACTION_DIGITS = 1;
const FALLBACK_UNIT = 'B';

export const formatBytes = (bytes: number): string => {
  const magnitude = Math.max(0, Math.trunc(bytes));

  if (magnitude < UNIT_STEP) {
    return `${magnitude} ${FALLBACK_UNIT}`;
  }

  const step = Math.min(
    Math.floor(Math.log(magnitude) / Math.log(UNIT_STEP)),
    BYTE_UNITS.length - 1,
  );
  const unit = BYTE_UNITS[step] ?? FALLBACK_UNIT;
  const scaled = magnitude / UNIT_STEP ** step;

  return `${scaled.toFixed(SCALED_FRACTION_DIGITS)} ${unit}`;
};
