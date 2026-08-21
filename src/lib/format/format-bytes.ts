const BYTE_UNITS = ['B', 'kB', 'MB', 'GB', 'TB', 'PB'];
const UNIT_STEP = 1000;
const SCALED_FRACTION_DIGITS = 1;
const FALLBACK_UNIT = 'B';

export const formatBytes = (bytes: number): string => {
  const magnitude = Math.max(0, Math.trunc(bytes));

  if (magnitude < UNIT_STEP) {
    return `${magnitude} ${FALLBACK_UNIT}`;
  }

  const largestStep = BYTE_UNITS.length - 1;
  const naturalStep = Math.min(
    Math.floor(Math.log(magnitude) / Math.log(UNIT_STEP)),
    largestStep,
  );
  const roundsUpAUnit =
    naturalStep < largestStep &&
    Number(
      (magnitude / UNIT_STEP ** naturalStep).toFixed(SCALED_FRACTION_DIGITS),
    ) >= UNIT_STEP;
  const step = roundsUpAUnit ? naturalStep + 1 : naturalStep;
  const unit = BYTE_UNITS[step] ?? FALLBACK_UNIT;
  const scaled = magnitude / UNIT_STEP ** step;

  return `${scaled.toFixed(SCALED_FRACTION_DIGITS)} ${unit}`;
};
