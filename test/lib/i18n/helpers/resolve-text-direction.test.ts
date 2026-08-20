import { resolveTextDirection } from '@/lib/i18n/helpers/resolve-text-direction';

describe('resolveTextDirection', () => {
  it('reads Hebrew as right-to-left, with or without a region', () => {
    expect(resolveTextDirection('he')).toBe('rtl');
    expect(resolveTextDirection('he-IL')).toBe('rtl');
  });

  it('reads English as left-to-right', () => {
    expect(resolveTextDirection('en')).toBe('ltr');
    expect(resolveTextDirection('en-US')).toBe('ltr');
  });

  it('ignores case, since a BCP-47 tag may arrive in any', () => {
    expect(resolveTextDirection('HE-il')).toBe('rtl');
  });

  it('falls back to left-to-right when a record carries no language', () => {
    expect(resolveTextDirection(undefined)).toBe('ltr');
    expect(resolveTextDirection('')).toBe('ltr');
  });

  it('covers the other right-to-left production languages, not only Hebrew', () => {
    expect(resolveTextDirection('ar')).toBe('rtl');
    expect(resolveTextDirection('fa')).toBe('rtl');
    expect(resolveTextDirection('ur')).toBe('rtl');
  });

  it('lets a script subtag overrule the language, since a language can be written either way', () => {
    expect(resolveTextDirection('yi-Latn')).toBe('ltr');
    expect(resolveTextDirection('he-Latn')).toBe('ltr');
    expect(resolveTextDirection('az-Arab')).toBe('rtl');
    expect(resolveTextDirection('pa-Arab')).toBe('rtl');
  });

  it('reads the deprecated code for Hebrew, which the contract still accepts', () => {
    expect(resolveTextDirection('iw')).toBe('rtl');
    expect(resolveTextDirection('iw-IL')).toBe('rtl');
  });

  it('is not confused by a region that happens to be four characters of something else', () => {
    expect(resolveTextDirection('zh-Hant')).toBe('ltr');
    expect(resolveTextDirection('ar-EG')).toBe('rtl');
  });
});
