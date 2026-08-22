import { formatDuration } from '@/lib/format/format-duration';

describe('formatDuration', () => {
  it.each([
    [30, '0:30'],
    [60, '1:00'],
    [180, '3:00'],
    [1_200, '20:00'],
    [1_230, '20:30'],
    [2_700, '45:00'],
    [3_600, '1:00:00'],
    [3_930, '1:05:30'],
  ])('renders %d seconds as %s', (seconds, expected) => {
    expect(formatDuration(seconds)).toBe(expected);
  });

  it('pads the seconds so two rows in a column line up', () => {
    expect(formatDuration(305)).toBe('5:05');
  });

  it('does not carry a rounded minute into the seconds column', () => {
    expect(formatDuration(119.7)).toBe('2:00');
  });

  it('keeps a sub-minute duration readable rather than showing bare seconds', () => {
    expect(formatDuration(9)).toBe('0:09');
  });

  it('clamps a negative to zero rather than printing a broken clock', () => {
    expect(formatDuration(-5)).toBe('0:00');
  });
});
