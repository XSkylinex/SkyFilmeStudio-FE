import { modelSetupReportSchema } from 'sky-filme-studio-be/contracts';
import type { ModelSetupReport } from 'sky-filme-studio-be/contracts';

export const buildModelSetupReport = (
  overrides: Partial<ModelSetupReport> = {},
): ModelSetupReport =>
  modelSetupReportSchema.parse({
    checkedAt: '2026-08-15T00:00:00.000Z',
    modelsRoot: 'models',
    ready: true,
    totalMissingBytes: 0,
    models: [
      {
        id: 'ltx-2.5-distilled',
        role: 'VIDEO',
        upstreamRepo: 'lightricks/ltx-video',
        license: 'openrail-m',
        totalBytes: 12_000_000_000,
        missingBytes: 0,
        ready: true,
        files: [
          {
            relativePath: 'video/ltx-2.5-distilled/model.safetensors',
            bytes: 12_000_000_000,
            status: 'VERIFIED',
            detail: 'Hash matches the manifest.',
          },
        ],
        downloadArgv: ['huggingface-cli', 'download', 'lightricks/ltx-video'],
      },
    ],
    ...overrides,
  });
