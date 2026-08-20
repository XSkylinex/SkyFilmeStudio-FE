import { EN_CATALOGUE } from '@/lib/i18n/catalogue/en';
import { translate } from '@/lib/i18n/helpers/translate';
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

describe('translate', () => {
  it('returns the key rather than throwing when a catalogue has no entry for it', () => {
    expect(translate({} as never, 'error.network')).toBe('error.network');
  });

  it('survives a catalogue that is not there at all, because a throw here blanks the page', () => {
    expect(translate(undefined, 'error.network')).toBe('error.network');
  });

  it('still interpolates a key it does have', () => {
    expect(translate(EN_CATALOGUE, 'error.status', { status: 500 })).toContain(
      '500',
    );
  });
});
