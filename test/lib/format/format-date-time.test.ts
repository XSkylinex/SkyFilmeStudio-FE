import { formatDateTime } from '@/lib/format/format-date-time';

const CHECKED_AT = '2026-08-21T09:41:07.000Z';

describe('formatDateTime', () => {
  it('renders a wire timestamp as something a person reads, not as the ISO string', () => {
    const formatted = formatDateTime(CHECKED_AT, 'en');

    expect(formatted).not.toBe(CHECKED_AT);
    expect(formatted).toContain('2026');
  });

  it('follows the interface language, because a date is prose rather than notation', () => {
    expect(formatDateTime(CHECKED_AT, 'he')).not.toBe(
      formatDateTime(CHECKED_AT, 'en'),
    );
  });

  it('hands back exactly what it was given when the value is not a date, instead of printing Invalid Date', () => {
    expect(formatDateTime('not a timestamp', 'en')).toBe('not a timestamp');
    expect(formatDateTime('', 'en')).toBe('');
  });
});
