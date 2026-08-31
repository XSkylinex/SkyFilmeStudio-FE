import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import { projectIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import {
  projectBiblesQueryKey,
  projectBiblesQueryOptions,
} from '@/features/bible/api/project-bibles.query';
import { PROJECT_BIBLES_STALE_TIME_MS } from '@/lib/query/query.constants';
import { buildProjectBible } from '../../../fixtures/project-bible.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const queryClientWithoutRetry = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

describe('projectBiblesQueryKey', () => {
  it('keys by project, so two projects never share a cached page', () => {
    const other = projectIdSchema.parse('d3f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e22');

    expect(projectBiblesQueryKey(PROJECT_ID)).toEqual([
      'project-bibles',
      PROJECT_ID,
    ]);
    expect(projectBiblesQueryKey(PROJECT_ID)).not.toEqual(
      projectBiblesQueryKey(other),
    );
  });
});

describe('projectBiblesQueryOptions', () => {
  it('uses PROJECT_BIBLES_STALE_TIME_MS as its staleTime', () => {
    expect(projectBiblesQueryOptions(PROJECT_ID).staleTime).toBe(
      PROJECT_BIBLES_STALE_TIME_MS,
    );
  });

  it('returns the page the orchestrator sent, carrying its keyset cursor', async () => {
    const page = { items: [buildProjectBible()], nextCursor: 'eyJpZCI6MX0' };
    server.use(
      http.get(API_PATH.projectBibles(PROJECT_ID), () =>
        HttpResponse.json(page),
      ),
    );

    await expect(
      queryClientWithoutRetry().fetchQuery(
        projectBiblesQueryOptions(PROJECT_ID),
      ),
    ).resolves.toEqual(page);
  });

  it('refuses a bible version the contract does not describe, rather than rendering it', async () => {
    server.use(
      http.get(API_PATH.projectBibles(PROJECT_ID), () =>
        HttpResponse.json({ items: [{ id: 'not-a-bible-id' }] }),
      ),
    );

    await expect(
      queryClientWithoutRetry().fetchQuery(
        projectBiblesQueryOptions(PROJECT_ID),
      ),
    ).rejects.toMatchObject({ kind: 'CONTRACT' });
  });
});
