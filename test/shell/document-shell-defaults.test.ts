import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  DEFAULT_DOCUMENT_DIRECTION,
  DEFAULT_INTERFACE_LANGUAGE,
} from '@/shell/document-language.constants';

const readRepoFile = (relativePath: string): string =>
  readFileSync(join(process.cwd(), relativePath), 'utf8');

const documentShell = new DOMParser().parseFromString(
  readRepoFile('index.html'),
  'text/html',
);

const canvasToken = readRepoFile('src/styles/tokens.css').match(
  /--color-surface-canvas:\s*light-dark\(\s*([^,]+),\s*(.+?)\s*\);/,
);
const backgroundTokens = canvasToken
  ? [canvasToken[1]?.trim(), canvasToken[2]?.trim()]
  : [];

const themeColorFor = (scheme: string): string | null =>
  documentShell
    .querySelector(`meta[name="theme-color"][media*="${scheme}"]`)
    ?.getAttribute('content') ?? null;

describe('the document shell agrees with the values src/ owns', () => {
  it('boots with the lang and dir the shell will apply, so the two cannot disagree', () => {
    expect(documentShell.documentElement.getAttribute('lang')).toBe(
      DEFAULT_INTERFACE_LANGUAGE,
    );
    expect(documentShell.documentElement.getAttribute('dir')).toBe(
      DEFAULT_DOCUMENT_DIRECTION,
    );
  });

  it('tints the titlebar with the same background tokens.css paints', () => {
    const [lightBackground, darkBackground] = backgroundTokens;

    expect(backgroundTokens).toHaveLength(2);
    expect(themeColorFor('light')).toBe(lightBackground);
    expect(themeColorFor('dark')).toBe(darkBackground);
  });

  it('keeps a boot fallback inside the root, which <noscript> alone cannot cover', () => {
    const fallback = documentShell.querySelector('#root #boot-fallback');

    expect(fallback?.textContent).toMatch(/bundle failed to load/i);
  });
});
