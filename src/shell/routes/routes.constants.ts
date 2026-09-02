export const ROOT_PATH = '/';

export const DESIGN_SYSTEM_SEGMENT = 'design-system';
export const SYSTEM_SEGMENT = 'system';
export const SFX_SEGMENT = 'sfx';

export const PROJECTS_SEGMENT = 'projects';
export const PROJECT_ID_PARAM = 'projectId';

export const ASSETS_SEGMENT = 'assets';
export const ASSET_ID_PARAM = 'assetId';
export const SUBJECTS_SEGMENT = 'subjects';
export const SUBJECT_ID_PARAM = 'subjectId';
export const STYLES_SEGMENT = 'styles';
export const VOICES_SEGMENT = 'voices';
export const LOCATIONS_SEGMENT = 'locations';
export const PROPS_SEGMENT = 'props';
export const BIBLE_SEGMENT = 'bible';

export const PRODUCTIONS_SEGMENT = 'productions';
export const PRODUCTION_ID_PARAM = 'productionId';

export const PLAN_SEGMENT = 'plan';
export const STORYBOARD_SEGMENT = 'storyboard';
export const QUEUE_SEGMENT = 'queue';
export const SHOTS_SEGMENT = 'shots';
export const SHOT_ID_PARAM = 'shotId';
export const AUDIO_SEGMENT = 'audio';
export const TIMELINE_SEGMENT = 'timeline';

export const projectListPath = (): string => ROOT_PATH;

export const designSystemPath = (): string => `/${DESIGN_SYSTEM_SEGMENT}`;

export const systemPath = (): string => `/${SYSTEM_SEGMENT}`;

export const sfxLibraryPath = (): string => `/${SFX_SEGMENT}`;

export const projectDashboardPath = (projectId: string): string =>
  `/${PROJECTS_SEGMENT}/${projectId}`;

export const projectAssetsPath = (projectId: string): string =>
  `${projectDashboardPath(projectId)}/${ASSETS_SEGMENT}`;

export const projectAssetPath = (projectId: string, assetId: string): string =>
  `${projectAssetsPath(projectId)}/${assetId}`;

export const projectSubjectsPath = (projectId: string): string =>
  `${projectDashboardPath(projectId)}/${SUBJECTS_SEGMENT}`;

export const subjectReviewPath = (
  projectId: string,
  subjectId: string,
): string => `${projectSubjectsPath(projectId)}/${subjectId}`;

export const projectStylesPath = (projectId: string): string =>
  `${projectDashboardPath(projectId)}/${STYLES_SEGMENT}`;

export const projectVoicesPath = (projectId: string): string =>
  `${projectDashboardPath(projectId)}/${VOICES_SEGMENT}`;

export const projectLocationsPath = (projectId: string): string =>
  `${projectDashboardPath(projectId)}/${LOCATIONS_SEGMENT}`;

export const projectPropsPath = (projectId: string): string =>
  `${projectDashboardPath(projectId)}/${PROPS_SEGMENT}`;

export const projectBiblePath = (projectId: string): string =>
  `${projectDashboardPath(projectId)}/${BIBLE_SEGMENT}`;

export const productionListPath = (projectId: string): string =>
  `${projectDashboardPath(projectId)}/${PRODUCTIONS_SEGMENT}`;

export const productionPath = (
  projectId: string,
  productionId: string,
): string => `${productionListPath(projectId)}/${productionId}`;

export const productionPlanPath = (
  projectId: string,
  productionId: string,
): string => `${productionPath(projectId, productionId)}/${PLAN_SEGMENT}`;

export const productionStoryboardPath = (
  projectId: string,
  productionId: string,
): string => `${productionPath(projectId, productionId)}/${STORYBOARD_SEGMENT}`;

export const productionQueuePath = (
  projectId: string,
  productionId: string,
): string => `${productionPath(projectId, productionId)}/${QUEUE_SEGMENT}`;

export const productionShotsPath = (
  projectId: string,
  productionId: string,
): string => `${productionPath(projectId, productionId)}/${SHOTS_SEGMENT}`;

export const productionShotPath = (
  projectId: string,
  productionId: string,
  shotId: string,
): string => `${productionShotsPath(projectId, productionId)}/${shotId}`;

export const productionAudioPath = (
  projectId: string,
  productionId: string,
): string => `${productionPath(projectId, productionId)}/${AUDIO_SEGMENT}`;

export const productionTimelinePath = (
  projectId: string,
  productionId: string,
): string => `${productionPath(projectId, productionId)}/${TIMELINE_SEGMENT}`;
