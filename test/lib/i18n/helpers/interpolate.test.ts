import { interpolate } from '@/lib/i18n/helpers/interpolate';

describe('interpolate', () => {
  it('substitutes a named placeholder', () => {
    expect(interpolate('status {status}.', { status: 507 })).toBe(
      'status 507.',
    );
  });

  it('leaves a placeholder alone when nothing supplies it, rather than printing undefined', () => {
    expect(interpolate('status {status}.', {})).toBe('status {status}.');
    expect(interpolate('status {status}.', undefined)).toBe('status {status}.');
  });

  it('leaves a sentence with no placeholders untouched', () => {
    expect(interpolate('nothing to fill', { status: 1 })).toBe(
      'nothing to fill',
    );
  });
});
