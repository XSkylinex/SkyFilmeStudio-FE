import { EN_CATALOGUE } from '@/lib/i18n/catalogue/en';
import { HE_CATALOGUE } from '@/lib/i18n/catalogue/he';
import { CATALOGUE } from '@/lib/i18n/catalogue';
import { INTERFACE_LANGUAGE } from '@/lib/i18n/i18n.constants';

describe('the catalogues', () => {
  it('carry exactly the same keys, so switching language cannot blank a string', () => {
    expect(Object.keys(HE_CATALOGUE).sort()).toEqual(
      Object.keys(EN_CATALOGUE).sort(),
    );
  });

  it('leaves no Hebrew string empty, or still carrying its English', () => {
    const sharedAcrossLanguages = [
      'language.en',
      'language.he',
      'audio.tier.dubit',
    ];
    const untranslated = Object.entries(HE_CATALOGUE)
      .filter(([key]) => !sharedAcrossLanguages.includes(key))
      .filter(
        ([key, value]) =>
          value === '' ||
          value === EN_CATALOGUE[key as keyof typeof EN_CATALOGUE],
      )
      .map(([key]) => key);

    expect(untranslated).toEqual([]);
  });

  it('keeps the runtime placeholder in both languages, or the status would never be filled in', () => {
    expect(EN_CATALOGUE['error.status']).toContain('{status}');
    expect(HE_CATALOGUE['error.status']).toContain('{status}');
  });

  it('never translates a language into anything but its own name', () => {
    expect(EN_CATALOGUE['language.he']).toBe(HE_CATALOGUE['language.he']);
    expect(EN_CATALOGUE['language.en']).toBe(HE_CATALOGUE['language.en']);
  });

  it('is reachable for every interface language the app offers', () => {
    for (const language of Object.values(INTERFACE_LANGUAGE)) {
      expect(CATALOGUE[language]).toBeDefined();
    }
  });
});
