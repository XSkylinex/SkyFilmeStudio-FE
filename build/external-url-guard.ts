import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative, resolve } from 'node:path';
import type { Plugin, ResolvedConfig } from 'vite';
import { findExternalUrls } from './find-external-urls.ts';

const PLUGIN_NAME = 'local-ai-studio:external-url-guard';

const TEXT_EXTENSIONS = [
  '.js',
  '.mjs',
  '.cjs',
  '.css',
  '.html',
  '.json',
  '.map',
  '.svg',
  '.txt',
  '.webmanifest',
  '.xml',
];

const collectTextFiles = async (directory: string): Promise<string[]> => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const entryPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectTextFiles(entryPath)));
    } else if (TEXT_EXTENSIONS.includes(extname(entry.name).toLowerCase())) {
      files.push(entryPath);
    }
  }

  return files;
};

export const externalUrlGuard = (): Plugin => {
  let outputDirectory = '';

  return {
    name: PLUGIN_NAME,
    apply: 'build',
    enforce: 'post',

    configResolved(config: ResolvedConfig): void {
      outputDirectory = resolve(config.root, config.build.outDir);
    },

    async closeBundle(): Promise<void> {
      const offences: string[] = [];

      for (const file of await collectTextFiles(outputDirectory)) {
        const urls = findExternalUrls(await readFile(file, 'utf8'));

        if (urls.length > 0) {
          offences.push(
            `  ${relative(outputDirectory, file)}\n${urls.map((url) => `    ${url}`).join('\n')}`,
          );
        }
      }

      if (offences.length > 0) {
        this.error(
          `${PLUGIN_NAME}: external URLs reached the build output.\n\n${offences.join('\n')}\n\n` +
            'This application must load every byte from its own output directory. ' +
            'Vendor the asset instead, or route the request through the orchestrator.',
        );
      }
    },
  };
};
