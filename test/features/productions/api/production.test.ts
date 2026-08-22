import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import {
  productionIdSchema,
  projectIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import {
  productionQueryKey,
  productionQueryOptions,
} from '@/features/productions/api/production.query';
import { PRODUCTION_DETAIL_STALE_TIME_MS } from '@/lib/query/query.constants';
import { buildProduction } from '../../../fixtures/production.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const PRODUCTION_ID = productionIdSchema.parse(
  '33333333-3333-4333-8333-333333333333',
);

const queryClientWithoutRetry = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

describe('productionQueryKey', () => {
  it('keys by project and production, so two productions never share a cached entry', () => {
    const otherProduction = productionIdSchema.parse(
      '99999999-9999-4999-8999-999999999999',
    );

    expect(productionQueryKey(PROJECT_ID, PRODUCTION_ID)).toEqual([
      'production',
      PROJECT_ID,
      PRODUCTION_ID,
    ]);
    expect(productionQueryKey(PROJECT_ID, PRODUCTION_ID)).not.toEqual(
      productionQueryKey(PROJECT_ID, otherProduction),
    );
  });
});

describe('productionQueryOptions', () => {
  it('uses PRODUCTION_DETAIL_STALE_TIME_MS as its staleTime', () => {
    expect(productionQueryOptions(PROJECT_ID, PRODUCTION_ID).staleTime).toBe(
      PRODUCTION_DETAIL_STALE_TIME_MS,
    );
  });

  it('fetches from the single-production path and returns the parsed production', async () => {
    const production = buildProduction({
      id: PRODUCTION_ID,
      projectId: PROJECT_ID,
    });
    server.use(
      http.get(API_PATH.production(PROJECT_ID, PRODUCTION_ID), () =>
        HttpResponse.json(production),
      ),
    );

    await expect(
      queryClientWithoutRetry().fetchQuery(
        productionQueryOptions(PROJECT_ID, PRODUCTION_ID),
      ),
    ).resolves.toEqual(production);
  });

  it('refuses a production missing its required styleProfileId', async () => {
    const production = buildProduction({
      id: PRODUCTION_ID,
      projectId: PROJECT_ID,
    });
    server.use(
      http.get(API_PATH.production(PROJECT_ID, PRODUCTION_ID), () =>
        HttpResponse.json({ ...production, styleProfileId: undefined }),
      ),
    );

    await expect(
      queryClientWithoutRetry().fetchQuery(
        productionQueryOptions(PROJECT_ID, PRODUCTION_ID),
      ),
    ).rejects.toMatchObject({ kind: 'CONTRACT' });
  });
});
