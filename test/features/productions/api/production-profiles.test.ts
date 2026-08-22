import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import { projectIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import {
  productionProfilesQueryKey,
  productionProfilesQueryOptions,
} from '@/features/productions/api/production-profiles.query';
import { PRODUCTION_PROFILES_STALE_TIME_MS } from '@/lib/query/query.constants';
import { buildProductionProfile } from '../../../fixtures/production-profile.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const queryClientWithoutRetry = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

describe('productionProfilesQueryKey', () => {
  it('keys by project, so two projects never share a cached page', () => {
    const other = projectIdSchema.parse('d3f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e22');

    expect(productionProfilesQueryKey(PROJECT_ID)).toEqual([
      'production-profiles',
      PROJECT_ID,
    ]);
    expect(productionProfilesQueryKey(PROJECT_ID)).not.toEqual(
      productionProfilesQueryKey(other),
    );
  });
});

describe('productionProfilesQueryOptions', () => {
  it('uses PRODUCTION_PROFILES_STALE_TIME_MS as its staleTime', () => {
    expect(productionProfilesQueryOptions(PROJECT_ID).staleTime).toBe(
      PRODUCTION_PROFILES_STALE_TIME_MS,
    );
  });

  it('returns the page the orchestrator sent, carrying its keyset cursor', async () => {
    const page = {
      items: [buildProductionProfile()],
      nextCursor: 'eyJpZCI6MX0',
    };
    server.use(
      http.get(API_PATH.productionProfiles(PROJECT_ID), () =>
        HttpResponse.json(page),
      ),
    );

    await expect(
      queryClientWithoutRetry().fetchQuery(
        productionProfilesQueryOptions(PROJECT_ID),
      ),
    ).resolves.toEqual(page);
  });

  it('refuses a production profile the contract does not describe, rather than rendering it', async () => {
    server.use(
      http.get(API_PATH.productionProfiles(PROJECT_ID), () =>
        HttpResponse.json({ items: [{ id: 'not-a-production-profile-id' }] }),
      ),
    );

    await expect(
      queryClientWithoutRetry().fetchQuery(
        productionProfilesQueryOptions(PROJECT_ID),
      ),
    ).rejects.toMatchObject({ kind: 'CONTRACT' });
  });
});
