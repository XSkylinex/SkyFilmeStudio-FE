import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import { externalUrlGuard } from './build/external-url-guard.ts';

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    externalUrlGuard(),
  ],
  resolve: {
    tsconfigPaths: true,
    alias: {
      'sky-filme-studio-be/contracts': fileURLToPath(
        new URL(
          './node_modules/sky-filme-studio-be/src/contracts/index.ts',
          import.meta.url,
        ),
      ),
    },
  },
});
