import { renderJobIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { ORCHESTRATOR_ROUTE_PREFIXES } from '@/lib/api/orchestrator-routes.constants';

const SAMPLE_RENDER_JOB_ID = renderJobIdSchema.parse(
  '33333333-3333-4333-8333-333333333333',
);

const everyPath: Record<string, string> = {
  systemMode: API_PATH.systemMode(),
  preflight: API_PATH.preflight(),
  modelSetup: API_PATH.modelSetup(),
  projects: API_PATH.projects(),
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
