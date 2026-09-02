import { readFileSync, globSync } from 'node:fs';
import { EN_CATALOGUE } from '@/lib/i18n/catalogue/en';

const SOURCES = globSync('src/**/*.{ts,tsx}');
const SENDS_A_CURSOR = /(?<!next)[Cc]ursor\s*[:,)]/;

const CLAIMS = [
  'continuity.list.firstPageOnly',
  'continuity.gaps.paging',
] as const;

describe('the sentences saying this app does not follow a page cursor', () => {
  it('still say it, so a reader is not told about a control that appeared', () => {
    for (const key of CLAIMS) {
      expect(EN_CATALOGUE[key]).toMatch(/cursor/i);
    }
  });

  it('are still true — no file under src/ sends one', () => {
    const senders = SOURCES.filter((file) =>
      SENDS_A_CURSOR.test(readFileSync(file, 'utf8')),
    );

    expect(senders).toStrictEqual([]);
  });

  it('scanned the tree it claims to scan', () => {
    expect(SOURCES.length).toBeGreaterThan(100);
  });
});
