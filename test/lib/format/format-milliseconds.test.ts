import { formatMilliseconds } from '@/lib/format/format-milliseconds';

describe('formatMilliseconds', () => {
  it('keeps two decimals, because a spoken line is judged in fractions of a second', () => {
    expect(formatMilliseconds(2_480)).toBe('2.48 s');
  });

  it('does not round a short pause away to nothing', () => {
    expect(formatMilliseconds(250)).toBe('0.25 s');
  });

  it('reads zero as zero rather than as absent', () => {
    expect(formatMilliseconds(0)).toBe('0.00 s');
  });

  it('refuses to render a negative duration', () => {
    expect(formatMilliseconds(-500)).toBe('0.00 s');
  });
});
