import type {
  CanonicalAssetSetId,
  ProjectId,
  RenderJobId,
  SourceAssetId,
  SubjectId,
} from 'sky-filme-studio-be/contracts';

export const API_PATH = {
  systemMode: (): string => '/system/mode',
  preflight: (): string => '/preflight',
  modelSetup: (): string => '/preflight/models',
  projects: (): string => '/projects',
  captureGuide: (): string => '/capture-guide',
  projectAssets: (projectId: ProjectId): string =>
    `/projects/${projectId}/assets`,
  projectAsset: (projectId: ProjectId, assetId: SourceAssetId): string =>
    `/projects/${projectId}/assets/${assetId}`,
  projectAssetThumbnail: (
    projectId: ProjectId,
    assetId: SourceAssetId,
  ): string => `/projects/${projectId}/assets/${assetId}/thumbnail`,
  projectAssetProxy: (projectId: ProjectId, assetId: SourceAssetId): string =>
    `/projects/${projectId}/assets/${assetId}/proxy`,
  projectSubjects: (projectId: ProjectId): string =>
    `/projects/${projectId}/subjects`,
  projectSubject: (projectId: ProjectId, subjectId: SubjectId): string =>
    `/projects/${projectId}/subjects/${subjectId}`,
  canonicalSets: (projectId: ProjectId, subjectId: SubjectId): string =>
    `/projects/${projectId}/subjects/${subjectId}/canonical-sets`,
  approvedCanonicalSet: (projectId: ProjectId, subjectId: SubjectId): string =>
    `/projects/${projectId}/subjects/${subjectId}/canonical-sets/approved`,
  approveCanonicalSet: (
    projectId: ProjectId,
    subjectId: SubjectId,
    setId: CanonicalAssetSetId,
  ): string =>
    `/projects/${projectId}/subjects/${subjectId}/canonical-sets/${setId}/approve`,
  canonicalReferences: (
    projectId: ProjectId,
    subjectId: SubjectId,
    setId: CanonicalAssetSetId,
  ): string =>
    `/projects/${projectId}/subjects/${subjectId}/canonical-sets/${setId}/references`,
  renderJob: (renderJobId: RenderJobId): string =>
    `/render-jobs/${renderJobId}`,
} satisfies Record<string, (...args: never[]) => string>;
