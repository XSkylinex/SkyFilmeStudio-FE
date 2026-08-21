import { matchRoutes } from 'react-router-dom';
import { routeTree } from '@/shell/routes/route-tree';
import * as routes from '@/shell/routes/routes.constants';

const PROJECT_ID = 'proj-1';
const PRODUCTION_ID = 'prod-1';
const ASSET_ID = 'asset-1';
const SUBJECT_ID = 'subj-1';
const SHOT_ID = 'shot-1';

const everyBuiltPath: Record<string, string> = {
  projectListPath: routes.projectListPath(),
  designSystemPath: routes.designSystemPath(),
  systemPath: routes.systemPath(),
  projectDashboardPath: routes.projectDashboardPath(PROJECT_ID),
  projectAssetsPath: routes.projectAssetsPath(PROJECT_ID),
  projectAssetPath: routes.projectAssetPath(PROJECT_ID, ASSET_ID),
  projectSubjectsPath: routes.projectSubjectsPath(PROJECT_ID),
  subjectReviewPath: routes.subjectReviewPath(PROJECT_ID, SUBJECT_ID),
  projectStylesPath: routes.projectStylesPath(PROJECT_ID),
  projectVoicesPath: routes.projectVoicesPath(PROJECT_ID),
  projectLocationsPath: routes.projectLocationsPath(PROJECT_ID),
  projectPropsPath: routes.projectPropsPath(PROJECT_ID),
  productionListPath: routes.productionListPath(PROJECT_ID),
  productionPath: routes.productionPath(PROJECT_ID, PRODUCTION_ID),
  productionPlanPath: routes.productionPlanPath(PROJECT_ID, PRODUCTION_ID),
  productionStoryboardPath: routes.productionStoryboardPath(
    PROJECT_ID,
    PRODUCTION_ID,
  ),
  productionQueuePath: routes.productionQueuePath(PROJECT_ID, PRODUCTION_ID),
  productionShotsPath: routes.productionShotsPath(PROJECT_ID, PRODUCTION_ID),
  productionShotPath: routes.productionShotPath(
    PROJECT_ID,
    PRODUCTION_ID,
    SHOT_ID,
  ),
  productionAudioPath: routes.productionAudioPath(PROJECT_ID, PRODUCTION_ID),
  productionTimelinePath: routes.productionTimelinePath(
    PROJECT_ID,
    PRODUCTION_ID,
  ),
};

describe('every exported path builder', () => {
  it('covers every builder the constants file exports, so this list cannot fall behind', () => {
    const exportedBuilders = Object.entries(routes)
      .filter(([, value]) => typeof value === 'function')
      .map(([name]) => name);

    expect([...exportedBuilders].sort()).toStrictEqual(
      Object.keys(everyBuiltPath).sort(),
    );
  });

  it.each(Object.entries(everyBuiltPath))(
    'resolves %s to a route that renders something',
    (_name, path) => {
      const matches = matchRoutes(routeTree, path);

      expect(matches).not.toBeNull();

      const leaf = matches?.at(-1);
      const rendersSomething =
        leaf?.route.Component !== undefined ||
        typeof leaf?.route.lazy === 'function' ||
        leaf?.route.loader !== undefined;

      expect(rendersSomething).toBe(true);
    },
  );

  it.each(Object.entries(everyBuiltPath))(
    'never falls through to the catch-all for %s',
    (_name, path) => {
      const leaf = matchRoutes(routeTree, path)?.at(-1);

      expect(leaf?.route.path).not.toBe('*');
    },
  );
});
