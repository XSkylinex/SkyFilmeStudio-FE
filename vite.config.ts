import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import { externalUrlGuard } from './build/external-url-guard.ts';
import { isDocumentRequest } from './build/is-document-request.ts';
import {
  ORCHESTRATOR_DEFAULT_ORIGIN,
  ORCHESTRATOR_ROUTE_PREFIXES,
} from './src/lib/api/orchestrator-routes.constants.ts';

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
  server: {
    proxy: Object.fromEntries(
      ORCHESTRATOR_ROUTE_PREFIXES.map((prefix) => [
        prefix,
        {
          target: ORCHESTRATOR_DEFAULT_ORIGIN,
          changeOrigin: false,
          bypass: (request) =>
            isDocumentRequest(request.headers) ? request.url : undefined,
        },
      ]),
    ),
  },
});
