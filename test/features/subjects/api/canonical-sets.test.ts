import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import {
  canonicalAssetSetIdSchema,
  projectIdSchema,
  subjectIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import {
  canonicalSetsQueryKey,
  canonicalSetsQueryOptions,
} from '@/features/subjects/api/canonical-sets.query';
import { CANONICAL_SETS_STALE_TIME_MS } from '@/lib/query/query.constants';
import { buildCanonicalAssetSet } from '../../../fixtures/canonical-asset-set.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const SUBJECT_ID = subjectIdSchema.parse(
  '66666666-6666-4666-8666-666666666666',
);

const buildQueryClient = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

describe('canonicalSetsQueryKey', () => {
  it('keys by project and subject, so two subjects never share a cached list', () => {
    const otherSubject = subjectIdSchema.parse(
      '99999999-9999-4999-8999-999999999999',
    );

    expect(canonicalSetsQueryKey(PROJECT_ID, SUBJECT_ID)).toEqual([
      'canonical-sets',
      PROJECT_ID,
      SUBJECT_ID,
    ]);
    expect(canonicalSetsQueryKey(PROJECT_ID, SUBJECT_ID)).not.toEqual(
      canonicalSetsQueryKey(PROJECT_ID, otherSubject),
    );
    expect(canonicalSetsQueryOptions(PROJECT_ID, SUBJECT_ID).staleTime).toBe(
      CANONICAL_SETS_STALE_TIME_MS,
    );
  });
});

describe('canonicalSetsQueryOptions', () => {
  it('parses the bare array the endpoint returns, not a paginated envelope, drafts included', async () => {
    const sets = [
      buildCanonicalAssetSet({
        subjectId: SUBJECT_ID,
        approvalState: 'PENDING',
        approvalVersion: undefined,
        approvedAt: undefined,
      }),
      buildCanonicalAssetSet({
        id: canonicalAssetSetIdSchema.parse(
          '33333333-3333-4333-8333-333333333333',
        ),
        subjectId: SUBJECT_ID,
        approvalState: 'APPROVED',
      }),
    ];
    server.use(
      http.get(API_PATH.canonicalSets(PROJECT_ID, SUBJECT_ID), () =>
        HttpResponse.json(sets),
      ),
    );

    await expect(
      buildQueryClient().fetchQuery(
        canonicalSetsQueryOptions(PROJECT_ID, SUBJECT_ID),
      ),
    ).resolves.toEqual(sets);
  });

  it('refuses a set with an approval state the contract does not define', async () => {
    server.use(
      http.get(API_PATH.canonicalSets(PROJECT_ID, SUBJECT_ID), () =>
        HttpResponse.json([
          {
            ...buildCanonicalAssetSet({ subjectId: SUBJECT_ID }),
            approvalState: 'FROZEN',
          },
        ]),
      ),
    );

    await expect(
      buildQueryClient().fetchQuery(
        canonicalSetsQueryOptions(PROJECT_ID, SUBJECT_ID),
      ),
    ).rejects.toMatchObject({ kind: 'CONTRACT' });
  });
});
