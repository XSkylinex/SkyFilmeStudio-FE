import {
  designSystemPath,
  productionAudioPath,
  productionListPath,
  productionPath,
  productionPlanPath,
  productionQueuePath,
  productionShotPath,
  productionShotsPath,
  productionStoryboardPath,
  productionTimelinePath,
  projectAssetsPath,
  projectDashboardPath,
  projectListPath,
  projectLocationsPath,
  projectPropsPath,
  projectStylesPath,
  projectSubjectsPath,
  projectVoicesPath,
  subjectReviewPath,
  systemPath,
} from '@/shell/routes/routes.constants';

describe('routes.constants path builders', () => {
  it('builds the argument-free paths', () => {
    expect(projectListPath()).toBe('/');
    expect(systemPath()).toBe('/system');
    expect(designSystemPath()).toBe('/design-system');
  });

  it('builds project-scoped paths from a project id', () => {
    expect(projectDashboardPath('proj-1')).toBe('/projects/proj-1');
    expect(projectAssetsPath('proj-1')).toBe('/projects/proj-1/assets');
    expect(projectSubjectsPath('proj-1')).toBe('/projects/proj-1/subjects');
    expect(projectStylesPath('proj-1')).toBe('/projects/proj-1/styles');
    expect(projectVoicesPath('proj-1')).toBe('/projects/proj-1/voices');
    expect(projectLocationsPath('proj-1')).toBe('/projects/proj-1/locations');
    expect(projectPropsPath('proj-1')).toBe('/projects/proj-1/props');
    expect(productionListPath('proj-1')).toBe('/projects/proj-1/productions');
  });

  it('builds a subject review path from a project and subject id', () => {
    expect(subjectReviewPath('proj-1', 'subj-1')).toBe(
      '/projects/proj-1/subjects/subj-1',
    );
  });

  it('builds production-scoped paths from a project and production id', () => {
    expect(productionPath('proj-1', 'prod-1')).toBe(
      '/projects/proj-1/productions/prod-1',
    );
    expect(productionPlanPath('proj-1', 'prod-1')).toBe(
      '/projects/proj-1/productions/prod-1/plan',
    );
    expect(productionStoryboardPath('proj-1', 'prod-1')).toBe(
      '/projects/proj-1/productions/prod-1/storyboard',
    );
    expect(productionQueuePath('proj-1', 'prod-1')).toBe(
      '/projects/proj-1/productions/prod-1/queue',
    );
    expect(productionShotsPath('proj-1', 'prod-1')).toBe(
      '/projects/proj-1/productions/prod-1/shots',
    );
    expect(productionAudioPath('proj-1', 'prod-1')).toBe(
      '/projects/proj-1/productions/prod-1/audio',
    );
    expect(productionTimelinePath('proj-1', 'prod-1')).toBe(
      '/projects/proj-1/productions/prod-1/timeline',
    );
  });

  it('builds a shot review path from a project, production and shot id', () => {
    expect(productionShotPath('proj-1', 'prod-1', 'shot-1')).toBe(
      '/projects/proj-1/productions/prod-1/shots/shot-1',
    );
  });
});
