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
  },
});
