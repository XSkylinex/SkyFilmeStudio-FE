import type { RenderJobId } from 'sky-filme-studio-be/contracts';

export const API_PATH = {
  systemMode: (): string => '/system/mode',
  preflight: (): string => '/preflight',
  modelSetup: (): string => '/preflight/models',
  projects: (): string => '/projects',
  renderJob: (renderJobId: RenderJobId): string =>
    `/render-jobs/${renderJobId}`,
} satisfies Record<string, (...args: never[]) => string>;
