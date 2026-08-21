import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import { API_PATH } from '@/lib/api/api.constants';
import {
  projectsQueryKey,
  projectsQueryOptions,
} from '@/features/projects/api/projects.query';
import { PROJECTS_STALE_TIME_MS } from '@/lib/query/query.constants';
import { buildProject } from '../../../fixtures/project.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const queryClientWithoutRetry = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

describe('projectsQueryKey', () => {
  it('returns a stable, predictable key', () => {
    expect(projectsQueryKey()).toEqual(['projects']);
    expect(projectsQueryKey()).toEqual(projectsQueryKey());
  });
});

describe('projectsQueryOptions', () => {
  it('uses PROJECTS_STALE_TIME_MS as its staleTime', () => {
    expect(projectsQueryOptions().staleTime).toBe(PROJECTS_STALE_TIME_MS);
  });

  it('returns the page the orchestrator sent, carrying its keyset cursor', async () => {
    const page = { items: [buildProject()], nextCursor: 'eyJpZCI6MX0' };

    server.use(http.get(API_PATH.projects(), () => HttpResponse.json(page)));

    await expect(
      queryClientWithoutRetry().fetchQuery(projectsQueryOptions()),
    ).resolves.toEqual(page);
  });

  it('refuses a project the contract does not describe, rather than rendering it', async () => {
    server.use(
      http.get(API_PATH.projects(), () =>
        HttpResponse.json({ items: [{ id: 'not-a-project-id' }] }),
      ),
    );

    await expect(
      queryClientWithoutRetry().fetchQuery(projectsQueryOptions()),
    ).rejects.toMatchObject({ kind: 'CONTRACT' });
  });
});
