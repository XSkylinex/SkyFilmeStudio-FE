import { readFileSync } from 'node:fs';
import { EN_CATALOGUE } from '@/lib/i18n/catalogue/en';
import { HE_CATALOGUE } from '@/lib/i18n/catalogue/he';

describe('the catalogue count in CLAUDE.md', () => {
  it('is the number of keys the catalogues hold, in both languages', () => {
    const claude = readFileSync('CLAUDE.md', 'utf8');
    const recorded = claude.match(
      /holds a typed catalogue of \*\*([\d,]+) keys in English\s+and Hebrew\*\*/,
    );

    expect(recorded).not.toBeNull();
    expect(Object.keys(HE_CATALOGUE)).toHaveLength(
      Object.keys(EN_CATALOGUE).length,
    );
    expect(recorded?.[1]).toBe(
      Object.keys(EN_CATALOGUE).length.toLocaleString('en-US'),
    );
  });
});
