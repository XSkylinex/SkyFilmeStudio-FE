import {
  canonicalAssetSetIdSchema,
  locationIdSchema,
  locationPlateIdSchema,
  projectIdSchema,
  pronunciationDictionaryIdSchema,
  propIdSchema,
  renderJobIdSchema,
  sourceAssetIdSchema,
  styleProfileIdSchema,
  subjectIdSchema,
  voiceProfileIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { ORCHESTRATOR_ROUTE_PREFIXES } from '@/lib/api/orchestrator-routes.constants';

const SAMPLE_RENDER_JOB_ID = renderJobIdSchema.parse(
  '33333333-3333-4333-8333-333333333333',
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

const SAMPLE_PRONUNCIATION_DICTIONARY_ID =
  pronunciationDictionaryIdSchema.parse('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');

const SAMPLE_LOCATION_ID = locationIdSchema.parse(
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
);

const SAMPLE_LOCATION_PLATE_ID = locationPlateIdSchema.parse(
  'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
);

const SAMPLE_PROP_ID = propIdSchema.parse(
  'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
);

const everyPath: Record<string, string> = {
  systemMode: API_PATH.systemMode(),
  preflight: API_PATH.preflight(),
  modelSetup: API_PATH.modelSetup(),
  projects: API_PATH.projects(),
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
  pronunciationDictionaries:
    API_PATH.pronunciationDictionaries(SAMPLE_PROJECT_ID),
  pronunciationDictionaryByLanguage:
    API_PATH.pronunciationDictionaryByLanguage(SAMPLE_PROJECT_ID),
  pronunciationDictionaryEntries: API_PATH.pronunciationDictionaryEntries(
    SAMPLE_PROJECT_ID,
    SAMPLE_PRONUNCIATION_DICTIONARY_ID,
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
  renderJob: API_PATH.renderJob(SAMPLE_RENDER_JOB_ID),
};

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
