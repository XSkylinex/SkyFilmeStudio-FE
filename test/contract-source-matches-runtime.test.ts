import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { ERROR_CODE } from 'sky-filme-studio-be/contracts';

const CONTRACT_PACKAGE = 'sky-filme-studio-be';
const CONTRACT_ENTRY = 'contracts';
const ERROR_CODE_SOURCE = join('src', 'contracts', 'enums', 'error-code.ts');

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
    const viteConfig = readFileSync(
      resolve(process.cwd(), 'vite.config.ts'),
      'utf8',
    );

    expect(viteConfig).toContain('tsconfigPaths');
    expect(viteConfig).not.toContain(`${CONTRACT_PACKAGE}/${CONTRACT_ENTRY}`);
  });

  it('serves the error codes the source declares, read as text so it cannot self-compare', () => {
    const declared = codesDeclaredInSource();

    expect(declared.length).toBeGreaterThan(20);
    expect(Object.values(ERROR_CODE).sort()).toEqual(declared.sort());
  });
});
