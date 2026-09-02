import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';

const STYLESHEETS = globSync('src/**/*.css');
const DEFINITION = /^\s*(--[a-zA-Z0-9-]+)\s*:/gm;
const USE_WITHOUT_FALLBACK = /var\(\s*(--[a-zA-Z0-9-]+)\s*\)/g;

const matchesOf = (pattern: RegExp, text: string): string[] =>
  [...text.matchAll(pattern)].map((match) => match[1] ?? '');

describe('every custom property a stylesheet reads', () => {
  it('is defined somewhere in src/, or the declaration is silently dropped', () => {
    const sources = STYLESHEETS.map((file) => readFileSync(file, 'utf8'));
    const defined = new Set(
      sources.flatMap((source) => matchesOf(DEFINITION, source)),
    );

    const undefinedUses = STYLESHEETS.flatMap((file, index) =>
      matchesOf(USE_WITHOUT_FALLBACK, sources[index] ?? '')
        .filter((name) => !defined.has(name))
        .map((name) => `${file}: ${name}`),
    );

    expect(undefinedUses).toStrictEqual([]);
  });

  it('found the stylesheets it claims to scan', () => {
    expect(STYLESHEETS.length).toBeGreaterThan(20);
  });
});
