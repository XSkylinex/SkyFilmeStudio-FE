import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import { projectIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import {
  productionsQueryKey,
  productionsQueryOptions,
} from '@/features/productions/api/productions.query';
import { PRODUCTIONS_STALE_TIME_MS } from '@/lib/query/query.constants';
import { buildProduction } from '../../../fixtures/production.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const queryClientWithoutRetry = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

describe('productionsQueryKey', () => {
  it('keys by project, so two projects never share a cached page', () => {
    const other = projectIdSchema.parse('d3f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e22');

    expect(productionsQueryKey(PROJECT_ID)).toEqual([
      'productions',
      PROJECT_ID,
    ]);
    expect(productionsQueryKey(PROJECT_ID)).not.toEqual(
      productionsQueryKey(other),
    );
  });
});

describe('productionsQueryOptions', () => {
  it('uses PRODUCTIONS_STALE_TIME_MS as its staleTime', () => {
    expect(productionsQueryOptions(PROJECT_ID).staleTime).toBe(
      PRODUCTIONS_STALE_TIME_MS,
    );
  });

  it('returns the page the orchestrator sent, carrying its keyset cursor', async () => {
    const page = { items: [buildProduction()], nextCursor: 'eyJpZCI6MX0' };
    server.use(
      http.get(API_PATH.productions(PROJECT_ID), () => HttpResponse.json(page)),
    );

    await expect(
      queryClientWithoutRetry().fetchQuery(productionsQueryOptions(PROJECT_ID)),
    ).resolves.toEqual(page);
  });

  it('refuses a production the contract does not describe, rather than rendering it', async () => {
    server.use(
      http.get(API_PATH.productions(PROJECT_ID), () =>
        HttpResponse.json({ items: [{ id: 'not-a-production-id' }] }),
      ),
    );

    await expect(
      queryClientWithoutRetry().fetchQuery(productionsQueryOptions(PROJECT_ID)),
    ).rejects.toMatchObject({ kind: 'CONTRACT' });
  });
});
