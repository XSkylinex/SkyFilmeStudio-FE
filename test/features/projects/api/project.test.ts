import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import { projectIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import {
  projectQueryKey,
  projectQueryOptions,
} from '@/features/projects/api/project.query';
import { projectsQueryKey } from '@/features/projects/api/projects.query';
import { PROJECTS_STALE_TIME_MS } from '@/lib/query/query.constants';
import { buildProject } from '../../../fixtures/project.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const queryClientWithoutRetry = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

describe('projectQueryKey', () => {
  it('does not sit under the collection key, so invalidating the list leaves it alone', () => {
    expect(projectQueryKey(PROJECT_ID)).toEqual(['project', PROJECT_ID]);
    expect(projectQueryKey(PROJECT_ID).slice(0, 1)).not.toEqual(
      projectsQueryKey(),
    );
  });
});

describe('projectQueryOptions', () => {
  it('uses PROJECTS_STALE_TIME_MS as its staleTime', () => {
    expect(projectQueryOptions(PROJECT_ID).staleTime).toBe(
      PROJECTS_STALE_TIME_MS,
    );
  });

  it('returns the one project the orchestrator sent, carrying the kind its bible depends on', async () => {
    const project = buildProject({ projectKind: 'MUSIC' });

    server.use(
      http.get(API_PATH.project(PROJECT_ID), () => HttpResponse.json(project)),
    );

    await expect(
      queryClientWithoutRetry().fetchQuery(projectQueryOptions(PROJECT_ID)),
    ).resolves.toEqual(project);
  });
});
