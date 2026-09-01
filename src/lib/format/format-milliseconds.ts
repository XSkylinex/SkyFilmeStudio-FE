const MS_PER_SECOND = 1_000;
const FRACTION_DIGITS = 2;

export const formatMilliseconds = (milliseconds: number): string =>
  `${(Math.max(0, milliseconds) / MS_PER_SECOND).toFixed(FRACTION_DIGITS)} s`;
