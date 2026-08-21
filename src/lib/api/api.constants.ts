import type {
  ProjectId,
  RenderJobId,
  SourceAssetId,
} from 'sky-filme-studio-be/contracts';

export const API_PATH = {
  systemMode: (): string => '/system/mode',
  preflight: (): string => '/preflight',
  modelSetup: (): string => '/preflight/models',
  projects: (): string => '/projects',
  captureGuide: (): string => '/capture-guide',
  projectAssets: (projectId: ProjectId): string =>
    `/projects/${projectId}/assets`,
  projectAssetThumbnail: (
    projectId: ProjectId,
    assetId: SourceAssetId,
  ): string => `/projects/${projectId}/assets/${assetId}/thumbnail`,
  projectAssetProxy: (projectId: ProjectId, assetId: SourceAssetId): string =>
    `/projects/${projectId}/assets/${assetId}/proxy`,
  renderJob: (renderJobId: RenderJobId): string =>
    `/render-jobs/${renderJobId}`,
} satisfies Record<string, (...args: never[]) => string>;
