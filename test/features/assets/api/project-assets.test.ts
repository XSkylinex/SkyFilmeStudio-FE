import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import { projectIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import {
  projectAssetsQueryKey,
  projectAssetsQueryOptions,
} from '@/features/assets/api/project-assets.query';
import { PROJECT_ASSETS_STALE_TIME_MS } from '@/lib/query/query.constants';
import { buildSourceAsset } from '../../../fixtures/source-asset.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

describe('projectAssetsQueryOptions', () => {
  it('keys by project, so two projects never share a cached page', () => {
    const other = projectIdSchema.parse('d3f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e22');

    expect(projectAssetsQueryKey(PROJECT_ID)).toEqual([
      'project-assets',
      PROJECT_ID,
    ]);
    expect(projectAssetsQueryKey(PROJECT_ID)).not.toEqual(
      projectAssetsQueryKey(other),
    );
    expect(projectAssetsQueryOptions(PROJECT_ID).staleTime).toBe(
      PROJECT_ASSETS_STALE_TIME_MS,
    );
  });

  it('returns the page, carrying its keyset cursor', async () => {
    const page = { items: [buildSourceAsset()], nextCursor: 'eyJpZCI6MX0' };
    server.use(
      http.get(API_PATH.projectAssets(PROJECT_ID), () =>
        HttpResponse.json(page),
      ),
    );

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    await expect(
      queryClient.fetchQuery(projectAssetsQueryOptions(PROJECT_ID)),
    ).resolves.toEqual(page);
  });

  it('refuses an asset carrying a machine-absolute path', async () => {
    server.use(
      http.get(API_PATH.projectAssets(PROJECT_ID), () =>
        HttpResponse.json({
          items: [{ ...buildSourceAsset(), path: '/Users/someone/IMG.jpg' }],
        }),
      ),
    );

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    await expect(
      queryClient.fetchQuery(projectAssetsQueryOptions(PROJECT_ID)),
    ).rejects.toMatchObject({ kind: 'CONTRACT' });
  });
});
