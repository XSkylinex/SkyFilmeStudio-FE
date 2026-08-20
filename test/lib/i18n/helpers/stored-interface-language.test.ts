import { readStoredInterfaceLanguage } from '@/lib/i18n/helpers/read-stored-interface-language';
import { writeStoredInterfaceLanguage } from '@/lib/i18n/helpers/write-stored-interface-language';

describe('the stored interface language', () => {
  it('falls back to English when storage is unavailable, rather than failing to boot', () => {
    expect(readStoredInterfaceLanguage()).toBe('en');
  });

  it('never throws when storage refuses a write', () => {
    expect(() => {
      writeStoredInterfaceLanguage('he');
    }).not.toThrow();
  });
});
