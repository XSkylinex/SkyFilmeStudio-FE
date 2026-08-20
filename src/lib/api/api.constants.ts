import type { RenderJobId } from 'sky-filme-studio-be/contracts';

export const API_PATH = {
  systemMode: (): string => '/system/mode',
  preflight: (): string => '/preflight',
  modelSetup: (): string => '/preflight/models',
  renderJob: (renderJobId: RenderJobId): string =>
    `/render-jobs/${renderJobId}`,
} satisfies Record<string, (...args: never[]) => string>;
