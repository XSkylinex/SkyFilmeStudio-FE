import { formatBytes } from '@/lib/format/format-bytes';

describe('formatBytes', () => {
  it('leaves a count below a kilobyte as whole bytes, with no misleading decimal', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(1)).toBe('1 B');
    expect(formatBytes(999)).toBe('999 B');
  });

  it('scales in decimal steps, so it agrees with what the operating system reports for a disk', () => {
    expect(formatBytes(1_000)).toBe('1.0 kB');
    expect(formatBytes(12_000_000_000)).toBe('12.0 GB');
    expect(formatBytes(500_000_000_000)).toBe('500.0 GB');
    expect(formatBytes(2_500_000_000_000)).toBe('2.5 TB');
  });

  it('keeps the largest unit it knows rather than inventing one', () => {
    expect(formatBytes(9_000_000_000_000_000)).toBe('9.0 PB');
  });

  it('never renders a negative or fractional byte count', () => {
    expect(formatBytes(-1)).toBe('0 B');
    expect(formatBytes(1.9)).toBe('1 B');
  });

  it('separates the fraction with a full stop whatever the ambient locale is, because a byte count is notation rather than prose', () => {
    expect(formatBytes(1_500_000)).toBe('1.5 MB');
  });
});
