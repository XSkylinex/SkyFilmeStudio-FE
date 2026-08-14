import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.ts';

// Merged rather than re-declared: the React Compiler pass and the `@/` alias
// have exactly one definition, in vite.config.ts. A second copy here is the
// drift that makes `typecheck` pass while `test` fails on the same import.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./test/setup.ts'],
      include: ['test/**/*.test.ts', 'test/**/*.test.tsx'],
      coverage: {
        provider: 'v8',
        include: ['src/**', 'build/**'],
      },
    },
  }),
);
