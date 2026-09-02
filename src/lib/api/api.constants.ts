import type {
  CanonicalAssetSetId,
  DialogueLineId,
  LocationId,
  LocationPlateId,
  ProductionId,
  ProductionProfileId,
  ProjectBibleVersionId,
  MusicCueId,
  OpeningEndingAssetId,
  ProjectId,
  PronunciationDictionaryEntryId,
  PronunciationDictionaryId,
  PropId,
  RenderJobId,
  SceneId,
  ShotId,
  SfxAssetId,
  SourceAssetId,
  StoryboardFrameId,
  StyleProfileId,
  SubjectId,
  VoiceProfileId,
} from 'sky-filme-studio-be/contracts';

export const API_PATH = {
  systemMode: (): string => '/system/mode',
  preflight: (): string => '/preflight',
  modelSetup: (): string => '/preflight/models',
  projects: (): string => '/projects',
  project: (projectId: ProjectId): string => `/projects/${projectId}`,
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
  styleProfiles: (projectId: ProjectId): string =>
    `/projects/${projectId}/style-profiles`,
  styleProfileVersions: (projectId: ProjectId): string =>
    `/projects/${projectId}/style-profiles/versions`,
  approvedStyleProfile: (projectId: ProjectId): string =>
    `/projects/${projectId}/style-profiles/approved`,
  styleProfile: (
    projectId: ProjectId,
    styleProfileId: StyleProfileId,
  ): string => `/projects/${projectId}/style-profiles/${styleProfileId}`,
  approveStyleProfile: (
    projectId: ProjectId,
    styleProfileId: StyleProfileId,
  ): string =>
    `/projects/${projectId}/style-profiles/${styleProfileId}/approve`,
  voiceProfiles: (projectId: ProjectId): string =>
    `/projects/${projectId}/voice-profiles`,
  approvedVoiceProfile: (projectId: ProjectId): string =>
    `/projects/${projectId}/voice-profiles/approved`,
  voiceProfile: (
    projectId: ProjectId,
    voiceProfileId: VoiceProfileId,
  ): string => `/projects/${projectId}/voice-profiles/${voiceProfileId}`,
  approveVoiceProfile: (
    projectId: ProjectId,
    voiceProfileId: VoiceProfileId,
  ): string =>
    `/projects/${projectId}/voice-profiles/${voiceProfileId}/approve`,
  sfxAssets: (): string => '/sfx-assets',
  sfxAsset: (sfxAssetId: SfxAssetId): string => `/sfx-assets/${sfxAssetId}`,
  approveSfxAsset: (sfxAssetId: SfxAssetId): string =>
    `/sfx-assets/${sfxAssetId}/approve`,
  openingEndingAssets: (projectId: ProjectId): string =>
    `/projects/${projectId}/opening-ending-assets`,
  openingEndingAsset: (
    projectId: ProjectId,
    openingEndingAssetId: OpeningEndingAssetId,
  ): string =>
    `/projects/${projectId}/opening-ending-assets/${openingEndingAssetId}`,
  approveOpeningEndingAsset: (
    projectId: ProjectId,
    openingEndingAssetId: OpeningEndingAssetId,
  ): string =>
    `/projects/${projectId}/opening-ending-assets/${openingEndingAssetId}/approve`,
  musicCues: (projectId: ProjectId): string =>
    `/projects/${projectId}/music-cues`,
  musicCue: (projectId: ProjectId, musicCueId: MusicCueId): string =>
    `/projects/${projectId}/music-cues/${musicCueId}`,
  approveMusicCue: (projectId: ProjectId, musicCueId: MusicCueId): string =>
    `/projects/${projectId}/music-cues/${musicCueId}/approve`,
  pronunciationDictionaries: (projectId: ProjectId): string =>
    `/projects/${projectId}/pronunciation-dictionaries`,
  pronunciationDictionaryByLanguage: (projectId: ProjectId): string =>
    `/projects/${projectId}/pronunciation-dictionaries/by-language`,
  pronunciationDictionaryEntry: (
    projectId: ProjectId,
    dictionaryId: PronunciationDictionaryId,
    entryId: PronunciationDictionaryEntryId,
  ): string =>
    `/projects/${projectId}/pronunciation-dictionaries/${dictionaryId}/entries/${entryId}`,
  pronunciationDictionaryEntries: (
    projectId: ProjectId,
    dictionaryId: PronunciationDictionaryId,
  ): string =>
    `/projects/${projectId}/pronunciation-dictionaries/${dictionaryId}/entries`,
  locations: (projectId: ProjectId): string =>
    `/projects/${projectId}/locations`,
  location: (projectId: ProjectId, locationId: LocationId): string =>
    `/projects/${projectId}/locations/${locationId}`,
  approveLocation: (projectId: ProjectId, locationId: LocationId): string =>
    `/projects/${projectId}/locations/${locationId}/approve`,
  locationPlate: (
    projectId: ProjectId,
    locationId: LocationId,
    locationPlateId: LocationPlateId,
  ): string =>
    `/projects/${projectId}/locations/${locationId}/plates/${locationPlateId}`,
  locationPlates: (projectId: ProjectId, locationId: LocationId): string =>
    `/projects/${projectId}/locations/${locationId}/plates`,
  approvedLocationPlate: (
    projectId: ProjectId,
    locationId: LocationId,
  ): string => `/projects/${projectId}/locations/${locationId}/plates/approved`,
  approveLocationPlate: (
    projectId: ProjectId,
    locationId: LocationId,
    plateId: LocationPlateId,
  ): string =>
    `/projects/${projectId}/locations/${locationId}/plates/${plateId}/approve`,
  projectProps: (projectId: ProjectId): string =>
    `/projects/${projectId}/props`,
  projectProp: (projectId: ProjectId, propId: PropId): string =>
    `/projects/${projectId}/props/${propId}`,
  approveProp: (projectId: ProjectId, propId: PropId): string =>
    `/projects/${projectId}/props/${propId}/approve`,
  projectBibles: (projectId: ProjectId): string =>
    `/projects/${projectId}/bible`,
  activeProjectBible: (projectId: ProjectId): string =>
    `/projects/${projectId}/bible/active`,
  projectBible: (
    projectId: ProjectId,
    bibleId: ProjectBibleVersionId,
  ): string => `/projects/${projectId}/bible/${bibleId}`,
  projectBibleMarkdown: (
    projectId: ProjectId,
    bibleId: ProjectBibleVersionId,
  ): string => `/projects/${projectId}/bible/${bibleId}/markdown`,
  publishProjectBible: (
    projectId: ProjectId,
    bibleId: ProjectBibleVersionId,
  ): string => `/projects/${projectId}/bible/${bibleId}/publish`,
  productions: (projectId: ProjectId): string =>
    `/projects/${projectId}/productions`,
  production: (projectId: ProjectId, productionId: ProductionId): string =>
    `/projects/${projectId}/productions/${productionId}`,
  productionTransitions: (
    projectId: ProjectId,
    productionId: ProductionId,
  ): string => `/projects/${projectId}/productions/${productionId}/transitions`,
  productionProfiles: (projectId: ProjectId): string =>
    `/projects/${projectId}/production-profiles`,
  productionProfile: (
    projectId: ProjectId,
    productionProfileId: ProductionProfileId,
  ): string =>
    `/projects/${projectId}/production-profiles/${productionProfileId}`,
  planningStages: (productionId: ProductionId): string =>
    `/productions/${productionId}/planning/stages`,
  planningBudget: (productionId: ProductionId): string =>
    `/productions/${productionId}/planning/budget`,
  planningApproval: (productionId: ProductionId): string =>
    `/productions/${productionId}/planning/approval`,
  planningScenes: (productionId: ProductionId): string =>
    `/productions/${productionId}/planning/scenes`,
  productionScore: (productionId: ProductionId): string =>
    `/productions/${productionId}/score`,
  sceneMixes: (sceneId: SceneId): string => `/scenes/${sceneId}/mixes`,
  productionMixes: (productionId: ProductionId): string =>
    `/productions/${productionId}/mixes`,
  sceneShots: (sceneId: SceneId): string => `/scenes/${sceneId}/shots`,
  shotStoryboardFrames: (shotId: ShotId): string =>
    `/shots/${shotId}/storyboard/frames`,
  shotKeyframeStatus: (shotId: ShotId): string =>
    `/shots/${shotId}/storyboard/keyframe-status`,
  storyboardFrameComparison: (frameId: StoryboardFrameId): string =>
    `/storyboard-frames/${frameId}/comparison`,
  storyboardFrameApproval: (frameId: StoryboardFrameId): string =>
    `/storyboard-frames/${frameId}/approval`,
  continuityFactsInForce: (
    productionId: ProductionId,
    sceneId: SceneId,
  ): string =>
    `/productions/${productionId}/continuity-facts/in-force?${new URLSearchParams(
      { scene: sceneId },
    ).toString()}`,
  renderJob: (renderJobId: RenderJobId): string =>
    `/render-jobs/${renderJobId}`,
  sceneDialogueLines: (sceneId: SceneId): string =>
    `/scenes/${sceneId}/dialogue-lines`,
  dialogueLine: (dialogueLineId: DialogueLineId): string =>
    `/dialogue-lines/${dialogueLineId}`,
  dialogueLineSpeech: (dialogueLineId: DialogueLineId): string =>
    `/dialogue-lines/${dialogueLineId}/speech`,
  dialogueLineSpeechApproval: (dialogueLineId: DialogueLineId): string =>
    `/dialogue-lines/${dialogueLineId}/speech/approval`,
  dialogueLineTier: (dialogueLineId: DialogueLineId): string =>
    `/dialogue-lines/${dialogueLineId}/dialogue-tier`,
  productionDialogueTiming: (productionId: ProductionId): string =>
    `/productions/${productionId}/dialogue-timing`,
  shotAudioCues: (shotId: ShotId): string => `/shots/${shotId}/audio-cues`,
  shotQcRuns: (shotId: ShotId): string => `/shots/${shotId}/qc/runs`,
  shotQcRequestReview: (shotId: ShotId): string =>
    `/shots/${shotId}/qc/request-review`,
} satisfies Record<string, (...args: never[]) => string>;
