import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import { projectIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import {
  activeProjectBibleQueryKey,
  activeProjectBibleQueryOptions,
} from '@/features/bible/api/active-project-bible.query';
import { ACTIVE_PROJECT_BIBLE_STALE_TIME_MS } from '@/lib/query/query.constants';
import { buildProjectBible } from '../../../fixtures/project-bible.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const buildQueryClient = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

describe('activeProjectBibleQueryKey', () => {
  it('keys by project, so two projects never share a cached active bible', () => {
    const other = projectIdSchema.parse('d3f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e22');

    expect(activeProjectBibleQueryKey(PROJECT_ID)).toEqual([
      'active-project-bible',
      PROJECT_ID,
    ]);
    expect(activeProjectBibleQueryKey(PROJECT_ID)).not.toEqual(
      activeProjectBibleQueryKey(other),
    );
    expect(activeProjectBibleQueryOptions(PROJECT_ID).staleTime).toBe(
      ACTIVE_PROJECT_BIBLE_STALE_TIME_MS,
    );
  });
});

describe('activeProjectBibleQueryOptions', () => {
  it('returns the active bible when the project has a published one', async () => {
    const bible = buildProjectBible({
      published: true,
      publishedAt: '2026-08-22T00:00:00.000Z',
    });
    server.use(
      http.get(API_PATH.activeProjectBible(PROJECT_ID), () =>
        HttpResponse.json(bible),
      ),
    );

    await expect(
      buildQueryClient().fetchQuery(activeProjectBibleQueryOptions(PROJECT_ID)),
    ).resolves.toEqual(bible);
  });

  it('resolves to null, not a rejection, when the project has no published bible yet', async () => {
    server.use(
      http.get(API_PATH.activeProjectBible(PROJECT_ID), () =>
        HttpResponse.json(
          {
            statusCode: 404,
            message: `Project ${PROJECT_ID} has no published bible yet`,
            error: 'Not Found',
          },
          { status: 404 },
        ),
      ),
    );

    await expect(
      buildQueryClient().fetchQuery(activeProjectBibleQueryOptions(PROJECT_ID)),
    ).resolves.toBeNull();
  });

  it('still rejects a failure that is not a 404', async () => {
    server.use(
      http.get(API_PATH.activeProjectBible(PROJECT_ID), () =>
        HttpResponse.json(
          { statusCode: 500, message: 'boom' },
          { status: 500 },
        ),
      ),
    );

    await expect(
      buildQueryClient().fetchQuery(activeProjectBibleQueryOptions(PROJECT_ID)),
    ).rejects.toMatchObject({ kind: 'HTTP', status: 500 });
  });
});
