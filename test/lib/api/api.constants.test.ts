import {
  projectIdSchema,
  renderJobIdSchema,
  sourceAssetIdSchema,
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

const everyPath: Record<string, string> = {
  systemMode: API_PATH.systemMode(),
  preflight: API_PATH.preflight(),
  modelSetup: API_PATH.modelSetup(),
  projects: API_PATH.projects(),
  captureGuide: API_PATH.captureGuide(),
  projectAssets: API_PATH.projectAssets(SAMPLE_PROJECT_ID),
  projectAssetThumbnail: API_PATH.projectAssetThumbnail(
    SAMPLE_PROJECT_ID,
    SAMPLE_SOURCE_ASSET_ID,
  ),
  projectAssetProxy: API_PATH.projectAssetProxy(
    SAMPLE_PROJECT_ID,
    SAMPLE_SOURCE_ASSET_ID,
  ),
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
