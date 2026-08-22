import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import * as runtimeContracts from 'sky-filme-studio-be/contracts';

const CONTRACT_PACKAGE = 'sky-filme-studio-be';
const CONTRACT_ENTRY = 'contracts';

interface ContractPackage {
  readonly exports: Record<string, { readonly types: string }>;
}

const resolveFromHere = createRequire(import.meta.url);

const packageJsonPath = resolveFromHere.resolve(
  `${CONTRACT_PACKAGE}/package.json`,
);

const packageJson = resolveFromHere(packageJsonPath) as ContractPackage;

const typesEntry = packageJson.exports[`./${CONTRACT_ENTRY}`]?.types;

const isString = (value: unknown): value is string => typeof value === 'string';

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const constantsOf = (
  namespace: Record<string, unknown>,
): Record<string, Record<string, unknown>> =>
  Object.fromEntries(
    Object.entries(namespace).flatMap(([name, value]) =>
      isPlainObject(value) && Object.values(value).every(isString)
        ? [[name, value]]
        : [],
    ),
  );

const importSource = async (): Promise<Record<string, unknown>> => {
  const sourceUrl = pathToFileURL(
    resolve(dirname(packageJsonPath), typesEntry ?? ''),
  ).href;

  return (await import(/* @vite-ignore */ sourceUrl)) as Record<
    string,
    unknown
  >;
};

describe('the contract this app typechecks against is the one it loads', () => {
  it('publishes a types condition, since the whole comparison hangs on it', () => {
    expect(typesEntry).toBeDefined();
  });

  it('loads the built copy at runtime while typecheck reads the source', () => {
    expect(
      import.meta.resolve(`${CONTRACT_PACKAGE}/${CONTRACT_ENTRY}`),
    ).toContain('/dist/');
    expect(typesEntry).toContain('/src/');
  });

  it('exports the same names from both copies', async () => {
    expect(Object.keys(await importSource()).sort()).toEqual(
      Object.keys(runtimeContracts).sort(),
    );
  });

  it('agrees on every string-valued constant, where a stale build goes unseen', async () => {
    const fromSource = constantsOf(await importSource());

    expect(Object.keys(fromSource)).toContain('ERROR_CODE');
    expect(constantsOf(runtimeContracts)).toEqual(fromSource);
  });

  it('notices a single added member, so agreement is a result and not a tautology', async () => {
    const fromSource = constantsOf(await importSource());
    const drifted = {
      ...fromSource,
      ERROR_CODE: { ...fromSource.ERROR_CODE, DRIFTED: 'DRIFTED' },
    };

    expect(constantsOf(runtimeContracts)).not.toEqual(drifted);
  });
});
