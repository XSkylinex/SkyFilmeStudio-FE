import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { ERROR_CODE } from 'sky-filme-studio-be/contracts';

const CONTRACT_PACKAGE = 'sky-filme-studio-be';
const CONTRACT_ENTRY = 'contracts';
const ERROR_CODE_SOURCE = join('src', 'contracts', 'enums', 'error-code.ts');
const ALIAS_CAPABLE_CONFIGS = [
  'vite.config.ts',
  'vitest.config.ts',
  'tsconfig.app.json',
];

interface ContractPackage {
  readonly exports: Record<
    string,
    {
      readonly types: string;
      readonly import: string;
      readonly require: string;
    }
  >;
}

const resolveFromHere = createRequire(import.meta.url);

const packageJsonPath = resolveFromHere.resolve(
  `${CONTRACT_PACKAGE}/package.json`,
);

const conditions = (resolveFromHere(packageJsonPath) as ContractPackage)
  .exports[`./${CONTRACT_ENTRY}`];

const codesDeclaredInSource = (): string[] => {
  const source = readFileSync(
    join(dirname(packageJsonPath), ERROR_CODE_SOURCE),
    'utf8',
  );

  return [...source.matchAll(/^ {2}'([A-Z_]+)',$/gmu)].map(
    ([, code]) => code ?? '',
  );
};

describe('the contract this app loads is one build, not two', () => {
  it('takes types from the same compilation as the code they describe', () => {
    expect(conditions?.types).not.toContain('/src/');
    expect(dirname(conditions?.types ?? '')).toBe(
      dirname(conditions?.import ?? ''),
    );
  });

  it('loads the tree-shakeable build, because the CommonJS one is 312 kB heavier', () => {
    expect(conditions?.import).toContain('dist-esm');
    expect(conditions?.require).not.toContain('dist-esm');
    expect(
      import.meta.resolve(`${CONTRACT_PACKAGE}/${CONTRACT_ENTRY}`),
    ).toContain('dist-esm');
  });

  it('is not aliased back onto the source, which no resolver would report', () => {
    const specifier = `${CONTRACT_PACKAGE}/${CONTRACT_ENTRY}`;

    for (const config of ALIAS_CAPABLE_CONFIGS) {
      expect(
        readFileSync(resolve(process.cwd(), config), 'utf8'),
      ).not.toContain(specifier);
    }
  });

  it('has really loaded the ESM copy, not merely resolved to it', () => {
    const fromCommonJs = resolveFromHere(
      join(dirname(packageJsonPath), 'dist', 'contracts', 'index.js'),
    ) as { readonly ERROR_CODE: Record<string, string> };

    expect(fromCommonJs.ERROR_CODE).toBeDefined();
    expect(ERROR_CODE).not.toBe(fromCommonJs.ERROR_CODE);
  });

  it('serves the error codes the source declares, read as text so it cannot self-compare', () => {
    const declared = codesDeclaredInSource();

    expect(declared.length).toBeGreaterThan(20);
    expect(Object.values(ERROR_CODE).sort()).toEqual(declared.sort());
  });
});
