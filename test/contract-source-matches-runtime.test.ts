import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import * as viaPackageSpecifier from 'sky-filme-studio-be/contracts';

const CONTRACT_PACKAGE = 'sky-filme-studio-be';
const CONTRACT_ENTRY = 'contracts';

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

  it('loads the very module typecheck reads, because vite.config.ts aliases it', async () => {
    const typesUrl = pathToFileURL(
      resolve(dirname(packageJsonPath), conditions?.types ?? ''),
    ).href;

    const fromSource = (await import(/* @vite-ignore */ typesUrl)) as Record<
      string,
      unknown
    >;

    expect(fromSource.ERROR_CODE).toBeDefined();
    expect(viaPackageSpecifier.ERROR_CODE).toBe(fromSource.ERROR_CODE);
  });
});
