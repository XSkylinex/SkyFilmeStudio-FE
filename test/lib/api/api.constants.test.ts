import {
  canonicalAssetSetIdSchema,
  continuityFactIdSchema,
  dialogueLineIdSchema,
  locationIdSchema,
  locationPlateIdSchema,
  productionIdSchema,
  productionProfileIdSchema,
  projectBibleVersionIdSchema,
  musicCueIdSchema,
  openingEndingAssetIdSchema,
  projectIdSchema,
  pronunciationDictionaryEntryIdSchema,
  pronunciationDictionaryIdSchema,
  propIdSchema,
  renderJobIdSchema,
  sceneIdSchema,
  sfxAssetIdSchema,
  shotIdSchema,
  sourceAssetIdSchema,
  storyboardFrameIdSchema,
  styleProfileIdSchema,
  subjectIdSchema,
  voiceProfileIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { ORCHESTRATOR_ROUTE_PREFIXES } from '@/lib/api/orchestrator-routes.constants';

const SAMPLE_RENDER_JOB_ID = renderJobIdSchema.parse(
  '33333333-3333-4333-8333-333333333333',
);

const SAMPLE_DIALOGUE_LINE_ID = dialogueLineIdSchema.parse(
  'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
);

const SAMPLE_PROJECT_ID = projectIdSchema.parse(
  '44444444-4444-4444-8444-444444444444',
);

const SAMPLE_SOURCE_ASSET_ID = sourceAssetIdSchema.parse(
  '55555555-5555-4555-8555-555555555555',
);

const SAMPLE_SUBJECT_ID = subjectIdSchema.parse(
  '66666666-6666-4666-8666-666666666666',
);

const SAMPLE_CANONICAL_ASSET_SET_ID = canonicalAssetSetIdSchema.parse(
  '77777777-7777-4777-8777-777777777777',
);

const SAMPLE_STYLE_PROFILE_ID = styleProfileIdSchema.parse(
  '88888888-8888-4888-8888-888888888888',
);

const SAMPLE_VOICE_PROFILE_ID = voiceProfileIdSchema.parse(
  '99999999-9999-4999-8999-999999999999',
);

const SAMPLE_MUSIC_CUE_ID = musicCueIdSchema.parse(
  '88888888-8888-4888-8888-888888888888',
);

const SAMPLE_OPENING_ENDING_ASSET_ID = openingEndingAssetIdSchema.parse(
  '99999999-9999-4999-8999-999999999999',
);

const SAMPLE_PRONUNCIATION_DICTIONARY_ID =
  pronunciationDictionaryIdSchema.parse('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');

const SAMPLE_PRONUNCIATION_ENTRY_ID =
  pronunciationDictionaryEntryIdSchema.parse(
    'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
  );

const SAMPLE_LOCATION_ID = locationIdSchema.parse(
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
);

const SAMPLE_LOCATION_PLATE_ID = locationPlateIdSchema.parse(
  'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
);

const SAMPLE_PROP_ID = propIdSchema.parse(
  'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
);

const SAMPLE_PRODUCTION_ID = productionIdSchema.parse(
  'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
);

const SAMPLE_PRODUCTION_PROFILE_ID = productionProfileIdSchema.parse(
  'ffffffff-ffff-4fff-8fff-ffffffffffff',
);

const SAMPLE_PROJECT_BIBLE_VERSION_ID = projectBibleVersionIdSchema.parse(
  '77777777-7777-4777-8777-777777777777',
);

const SAMPLE_SCENE_ID = sceneIdSchema.parse(
  '00000000-0000-4000-8000-000000000000',
);
const SAMPLE_CONTINUITY_FACT_ID = continuityFactIdSchema.parse(
  '77777777-7777-4777-8777-777777777777',
);

const SAMPLE_SHOT_ID = shotIdSchema.parse(
  '11111111-1111-4111-8111-111111111111',
);

const SAMPLE_SFX_ASSET_ID = sfxAssetIdSchema.parse(
  '77777777-7777-4777-8777-777777777777',
);

const SAMPLE_STORYBOARD_FRAME_ID = storyboardFrameIdSchema.parse(
  '22222222-2222-4222-8222-222222222222',
);

const everyPath: Record<string, string> = {
  systemMode: API_PATH.systemMode(),
  preflight: API_PATH.preflight(),
  modelSetup: API_PATH.modelSetup(),
  projects: API_PATH.projects(),
  project: API_PATH.project(SAMPLE_PROJECT_ID),
  captureGuide: API_PATH.captureGuide(),
  projectAssets: API_PATH.projectAssets(SAMPLE_PROJECT_ID),
  projectAsset: API_PATH.projectAsset(
    SAMPLE_PROJECT_ID,
    SAMPLE_SOURCE_ASSET_ID,
  ),
  projectAssetThumbnail: API_PATH.projectAssetThumbnail(
    SAMPLE_PROJECT_ID,
    SAMPLE_SOURCE_ASSET_ID,
  ),
  projectAssetProxy: API_PATH.projectAssetProxy(
    SAMPLE_PROJECT_ID,
    SAMPLE_SOURCE_ASSET_ID,
  ),
  projectSubjects: API_PATH.projectSubjects(SAMPLE_PROJECT_ID),
  projectSubject: API_PATH.projectSubject(SAMPLE_PROJECT_ID, SAMPLE_SUBJECT_ID),
  canonicalSets: API_PATH.canonicalSets(SAMPLE_PROJECT_ID, SAMPLE_SUBJECT_ID),
  approvedCanonicalSet: API_PATH.approvedCanonicalSet(
    SAMPLE_PROJECT_ID,
    SAMPLE_SUBJECT_ID,
  ),
  approveCanonicalSet: API_PATH.approveCanonicalSet(
    SAMPLE_PROJECT_ID,
    SAMPLE_SUBJECT_ID,
    SAMPLE_CANONICAL_ASSET_SET_ID,
  ),
  canonicalReferences: API_PATH.canonicalReferences(
    SAMPLE_PROJECT_ID,
    SAMPLE_SUBJECT_ID,
    SAMPLE_CANONICAL_ASSET_SET_ID,
  ),
  styleProfiles: API_PATH.styleProfiles(SAMPLE_PROJECT_ID),
  styleProfileVersions: API_PATH.styleProfileVersions(SAMPLE_PROJECT_ID),
  approvedStyleProfile: API_PATH.approvedStyleProfile(SAMPLE_PROJECT_ID),
  styleProfile: API_PATH.styleProfile(
    SAMPLE_PROJECT_ID,
    SAMPLE_STYLE_PROFILE_ID,
  ),
  approveStyleProfile: API_PATH.approveStyleProfile(
    SAMPLE_PROJECT_ID,
    SAMPLE_STYLE_PROFILE_ID,
  ),
  voiceProfiles: API_PATH.voiceProfiles(SAMPLE_PROJECT_ID),
  approvedVoiceProfile: API_PATH.approvedVoiceProfile(SAMPLE_PROJECT_ID),
  voiceProfile: API_PATH.voiceProfile(
    SAMPLE_PROJECT_ID,
    SAMPLE_VOICE_PROFILE_ID,
  ),
  approveVoiceProfile: API_PATH.approveVoiceProfile(
    SAMPLE_PROJECT_ID,
    SAMPLE_VOICE_PROFILE_ID,
  ),
  openingEndingAssets: API_PATH.openingEndingAssets(SAMPLE_PROJECT_ID),
  openingEndingAsset: API_PATH.openingEndingAsset(
    SAMPLE_PROJECT_ID,
    SAMPLE_OPENING_ENDING_ASSET_ID,
  ),
  approveOpeningEndingAsset: API_PATH.approveOpeningEndingAsset(
    SAMPLE_PROJECT_ID,
    SAMPLE_OPENING_ENDING_ASSET_ID,
  ),
  musicCues: API_PATH.musicCues(SAMPLE_PROJECT_ID),
  musicCueRenders: API_PATH.musicCueRenders(SAMPLE_PROJECT_ID),
  musicCue: API_PATH.musicCue(SAMPLE_PROJECT_ID, SAMPLE_MUSIC_CUE_ID),
  approveMusicCue: API_PATH.approveMusicCue(
    SAMPLE_PROJECT_ID,
    SAMPLE_MUSIC_CUE_ID,
  ),
  pronunciationDictionaries:
    API_PATH.pronunciationDictionaries(SAMPLE_PROJECT_ID),
  pronunciationDictionaryByLanguage:
    API_PATH.pronunciationDictionaryByLanguage(SAMPLE_PROJECT_ID),
  pronunciationDictionaryEntries: API_PATH.pronunciationDictionaryEntries(
    SAMPLE_PROJECT_ID,
    SAMPLE_PRONUNCIATION_DICTIONARY_ID,
  ),
  pronunciationDictionaryEntry: API_PATH.pronunciationDictionaryEntry(
    SAMPLE_PROJECT_ID,
    SAMPLE_PRONUNCIATION_DICTIONARY_ID,
    SAMPLE_PRONUNCIATION_ENTRY_ID,
  ),
  locations: API_PATH.locations(SAMPLE_PROJECT_ID),
  location: API_PATH.location(SAMPLE_PROJECT_ID, SAMPLE_LOCATION_ID),
  approveLocation: API_PATH.approveLocation(
    SAMPLE_PROJECT_ID,
    SAMPLE_LOCATION_ID,
  ),
  locationPlates: API_PATH.locationPlates(
    SAMPLE_PROJECT_ID,
    SAMPLE_LOCATION_ID,
  ),
  locationPlate: API_PATH.locationPlate(
    SAMPLE_PROJECT_ID,
    SAMPLE_LOCATION_ID,
    SAMPLE_LOCATION_PLATE_ID,
  ),
  approvedLocationPlate: API_PATH.approvedLocationPlate(
    SAMPLE_PROJECT_ID,
    SAMPLE_LOCATION_ID,
  ),
  approveLocationPlate: API_PATH.approveLocationPlate(
    SAMPLE_PROJECT_ID,
    SAMPLE_LOCATION_ID,
    SAMPLE_LOCATION_PLATE_ID,
  ),
  projectProps: API_PATH.projectProps(SAMPLE_PROJECT_ID),
  projectProp: API_PATH.projectProp(SAMPLE_PROJECT_ID, SAMPLE_PROP_ID),
  approveProp: API_PATH.approveProp(SAMPLE_PROJECT_ID, SAMPLE_PROP_ID),
  projectBibles: API_PATH.projectBibles(SAMPLE_PROJECT_ID),
  activeProjectBible: API_PATH.activeProjectBible(SAMPLE_PROJECT_ID),
  projectBible: API_PATH.projectBible(
    SAMPLE_PROJECT_ID,
    SAMPLE_PROJECT_BIBLE_VERSION_ID,
  ),
  projectBibleMarkdown: API_PATH.projectBibleMarkdown(
    SAMPLE_PROJECT_ID,
    SAMPLE_PROJECT_BIBLE_VERSION_ID,
  ),
  publishProjectBible: API_PATH.publishProjectBible(
    SAMPLE_PROJECT_ID,
    SAMPLE_PROJECT_BIBLE_VERSION_ID,
  ),
  productions: API_PATH.productions(SAMPLE_PROJECT_ID),
  production: API_PATH.production(SAMPLE_PROJECT_ID, SAMPLE_PRODUCTION_ID),
  productionTransitions: API_PATH.productionTransitions(
    SAMPLE_PROJECT_ID,
    SAMPLE_PRODUCTION_ID,
  ),
  productionProfiles: API_PATH.productionProfiles(SAMPLE_PROJECT_ID),
  productionProfile: API_PATH.productionProfile(
    SAMPLE_PROJECT_ID,
    SAMPLE_PRODUCTION_PROFILE_ID,
  ),
  planningStages: API_PATH.planningStages(SAMPLE_PRODUCTION_ID),
  planningBudget: API_PATH.planningBudget(SAMPLE_PRODUCTION_ID),
  planningApproval: API_PATH.planningApproval(SAMPLE_PRODUCTION_ID),
  planningScenes: API_PATH.planningScenes(SAMPLE_PRODUCTION_ID),
  sfxAssets: API_PATH.sfxAssets(),
  sfxAsset: API_PATH.sfxAsset(SAMPLE_SFX_ASSET_ID),
  approveSfxAsset: API_PATH.approveSfxAsset(SAMPLE_SFX_ASSET_ID),
  productionScore: API_PATH.productionScore(SAMPLE_PRODUCTION_ID),
  sceneMixes: API_PATH.sceneMixes(SAMPLE_SCENE_ID),
  productionMixes: API_PATH.productionMixes(SAMPLE_PRODUCTION_ID),
  sceneShots: API_PATH.sceneShots(SAMPLE_SCENE_ID),
  shotStoryboardFrames: API_PATH.shotStoryboardFrames(SAMPLE_SHOT_ID),
  shotKeyframeStatus: API_PATH.shotKeyframeStatus(SAMPLE_SHOT_ID),
  storyboardFrameComparison: API_PATH.storyboardFrameComparison(
    SAMPLE_STORYBOARD_FRAME_ID,
  ),
  storyboardFrameApproval: API_PATH.storyboardFrameApproval(
    SAMPLE_STORYBOARD_FRAME_ID,
  ),
  continuityFactsInForce: API_PATH.continuityFactsInForce(
    SAMPLE_PRODUCTION_ID,
    SAMPLE_SCENE_ID,
  ),
  renderJob: API_PATH.renderJob(SAMPLE_RENDER_JOB_ID),
  sceneDialogueLines: API_PATH.sceneDialogueLines(SAMPLE_SCENE_ID),
  dialogueLine: API_PATH.dialogueLine(SAMPLE_DIALOGUE_LINE_ID),
  dialogueLineSpeech: API_PATH.dialogueLineSpeech(SAMPLE_DIALOGUE_LINE_ID),
  dialogueLineSpeechApproval: API_PATH.dialogueLineSpeechApproval(
    SAMPLE_DIALOGUE_LINE_ID,
  ),
  dialogueLineTier: API_PATH.dialogueLineTier(SAMPLE_DIALOGUE_LINE_ID),
  productionDialogueTiming:
    API_PATH.productionDialogueTiming(SAMPLE_PRODUCTION_ID),
  shotAudioCues: API_PATH.shotAudioCues(SAMPLE_SHOT_ID),
  shotQcRuns: API_PATH.shotQcRuns(SAMPLE_SHOT_ID),
  shotQcRequestReview: API_PATH.shotQcRequestReview(SAMPLE_SHOT_ID),
  productionBible: API_PATH.productionBible(SAMPLE_PRODUCTION_ID),
  continuityFacts: API_PATH.continuityFacts(SAMPLE_PRODUCTION_ID),
  continuityFact: API_PATH.continuityFact(
    SAMPLE_PRODUCTION_ID,
    SAMPLE_CONTINUITY_FACT_ID,
  ),
  planningContext: API_PATH.planningContext(
    SAMPLE_PRODUCTION_ID,
    SAMPLE_SCENE_ID,
  ),
};

describe('API_PATH.continuityFacts', () => {
  it('sends no query string when nothing is filtered', () => {
    expect(API_PATH.continuityFacts(SAMPLE_PRODUCTION_ID)).toBe(
      `/productions/${SAMPLE_PRODUCTION_ID}/continuity-facts`,
    );
  });

  it('narrows to one entity, which is the only way this app can name one', () => {
    expect(
      API_PATH.continuityFacts(SAMPLE_PRODUCTION_ID, {
        entityId: SAMPLE_SCENE_ID,
      }),
    ).toBe(
      `/productions/${SAMPLE_PRODUCTION_ID}/continuity-facts?entityId=${SAMPLE_SCENE_ID}`,
    );
  });

  it('escapes a property rather than pasting it into the query string', () => {
    expect(
      API_PATH.continuityFacts(SAMPLE_PRODUCTION_ID, {
        property: 'costume state',
      }),
    ).toContain('property=costume+state');
  });

  it('omits an absent filter instead of sending it empty', () => {
    expect(
      API_PATH.continuityFacts(SAMPLE_PRODUCTION_ID, {
        property: 'mood',
        entityId: undefined,
      }),
    ).toBe(`/productions/${SAMPLE_PRODUCTION_ID}/continuity-facts?property=mood`);
  });
});

describe('API_PATH', () => {
  it('covers every path builder the module exports, so this list cannot fall behind', () => {
    expect(Object.keys(API_PATH).sort()).toStrictEqual(
      Object.keys(everyPath).sort(),
    );
  });

  it.each(Object.entries(everyPath))(
    'gives %s a path the dev proxy forwards to the orchestrator',
    (_name, path) => {
      expect(
        ORCHESTRATOR_ROUTE_PREFIXES.some((prefix) => path.startsWith(prefix)),
      ).toBe(true);
    },
  );
});
