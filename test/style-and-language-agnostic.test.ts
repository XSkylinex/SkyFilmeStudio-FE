import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const SRC = join(process.cwd(), 'src');

const STYLE_MODES = [
  'SOURCE_FAITHFUL',
  'PHOTOREAL_CINEMATIC',
  'ANIME_ORIGINAL',
  'CARTOON_2D',
  'CG_3D_STYLIZED',
  'STOP_MOTION_STYLE',
  'ILLUSTRATED_STORYBOOK',
  'MIXED_MEDIA',
];

const SUGGESTED_PLATE_KIND_NAMES = [
  'WIDE_ESTABLISHING',
  'MEDIUM_LEFT',
  'MEDIUM_RIGHT',
  'CLOSE_DETAIL',
];

const INVENTED_PLATE_KINDS = ['NIGHT', 'DAY', 'DAMAGED'];

const LANGUAGE_TAGS = ['he', 'he-IL', 'iw', 'en', 'en-US'];

const LANGUAGE_MECHANISM_FILES: readonly string[] = [
  join('lib', 'i18n', 'i18n.constants.ts'),
  join('lib', 'i18n', 'interfaces', 'interface-language.ts'),
  join('shell', 'document-language.constants.ts'),
];

const MINIMUM_SOURCE_FILES = 150;

interface Finding {
  readonly file: string;
  readonly line: number;
  readonly text: string;
}

const sourceFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = join(directory, entry.name);

    if (entry.isDirectory()) {
      return sourceFiles(full);
    }

    return entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')
      ? [full]
      : [];
  });

const scan = (pattern: RegExp): Finding[] =>
  sourceFiles(SRC).flatMap((file) =>
    readFileSync(file, 'utf8')
      .split('\n')
      .flatMap((text, index) =>
        pattern.test(text)
          ? [{ file: relative(SRC, file), line: index + 1, text: text.trim() }]
          : [],
      ),
  );

const anywhere = (values: readonly string[]): RegExp =>
  new RegExp(`\\b(?:${values.join('|')})\\b`, 'u');

const quotedAnyStyle = (values: readonly string[]): RegExp =>
  new RegExp(`['"\`](?:${values.join('|')})['"\`]`, 'u');

describe('the interface stays style-agnostic and language-agnostic', () => {
  it('names no style mode, because the suggestion list belongs to the contract', () => {
    expect(scan(anywhere(STYLE_MODES))).toEqual([]);
  });

  it('names no plate kind, because that vocabulary is open and lives on the wire', () => {
    expect(scan(anywhere(SUGGESTED_PLATE_KIND_NAMES))).toEqual([]);
  });

  it('invents no lighting-variant plate kind, because the contract publishes none', () => {
    expect(scan(anywhere(INVENTED_PLATE_KINDS))).toEqual([]);
  });

  it('mentions no anime, which is the preset this product must never default to', () => {
    expect(scan(/anime/iu)).toEqual([]);
  });

  it('names a language only where choosing the interface language is the mechanism', () => {
    const findings = scan(quotedAnyStyle(LANGUAGE_TAGS)).filter(
      (finding) => !LANGUAGE_MECHANISM_FILES.includes(finding.file),
    );

    expect(findings).toEqual([]);
  });

  it('carries no language-named field, because text travels with its own language tag', () => {
    expect(scan(/\b\w*(?:hebrew|english|arabic|spanish)\w*\s*[:?=]/iu)).toEqual(
      [],
    );
  });

  it('reads a real tree, so an empty result means agnostic rather than nothing scanned', () => {
    expect(sourceFiles(SRC).length).toBeGreaterThan(MINIMUM_SOURCE_FILES);
  });
});
