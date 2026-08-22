import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { ERROR_CODE } from 'sky-filme-studio-be/contracts';

const CONTRACT_PACKAGE = 'sky-filme-studio-be';
const CONTRACT_ENTRY = 'contracts';
const ERROR_CODE_FILE = join('enums', 'error-code.ts');

interface ContractPackage {
  readonly exports: Record<
    string,
    { readonly types: string; readonly default: string }
  >;
}

const resolveFromHere = createRequire(import.meta.url);

const packageJsonPath = resolveFromHere.resolve(
  `${CONTRACT_PACKAGE}/package.json`,
);

const conditions = (resolveFromHere(packageJsonPath) as ContractPackage)
  .exports[`./${CONTRACT_ENTRY}`];

const typesPath = resolve(dirname(packageJsonPath), conditions?.types ?? '');

const codesDeclaredInSource = (): string[] => {
  const source = readFileSync(
    join(dirname(typesPath), ERROR_CODE_FILE),
    'utf8',
  );

  return [...source.matchAll(/^ {2}'([A-Z_]+)',$/gmu)].map(
    ([, code]) => code ?? '',
  );
};

const viteConfig = readFileSync(
  resolve(process.cwd(), 'vite.config.ts'),
  'utf8',
);

describe('the contract this app loads is the contract it typechecks', () => {
  it('publishes a types and a default condition that point at different trees', () => {
    expect(conditions?.types).toContain('/src/');
    expect(conditions?.default).toContain('/dist/');
  });

  it('would reach the build output on bare resolution, which is the trap', () => {
    expect(
      import.meta.resolve(`${CONTRACT_PACKAGE}/${CONTRACT_ENTRY}`),
    ).toContain('/dist/');
  });

  it('is aliased away from that trap by vite.config.ts, which load-bears', () => {
    expect(viteConfig).toContain(`'${CONTRACT_PACKAGE}/${CONTRACT_ENTRY}'`);
    expect(viteConfig).toContain(`${CONTRACT_PACKAGE}/src/${CONTRACT_ENTRY}`);
  });

  it('serves the error codes the source declares, read as text so it cannot self-compare', () => {
    const declared = codesDeclaredInSource();

    expect(declared.length).toBeGreaterThan(20);
    expect(Object.values(ERROR_CODE).sort()).toEqual(declared.sort());
  });
});
