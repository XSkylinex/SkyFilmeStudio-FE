import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import {
  projectIdSchema,
  subjectIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import {
  approvedCanonicalSetQueryKey,
  approvedCanonicalSetQueryOptions,
} from '@/features/subjects/api/approved-canonical-set.query';
import { APPROVED_CANONICAL_SET_STALE_TIME_MS } from '@/lib/query/query.constants';
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

describe('approvedCanonicalSetQueryKey', () => {
  it('keys by project and subject, so two subjects never share a cached head', () => {
    const otherSubject = subjectIdSchema.parse(
      '99999999-9999-4999-8999-999999999999',
    );

    expect(approvedCanonicalSetQueryKey(PROJECT_ID, SUBJECT_ID)).toEqual([
      'approved-canonical-set',
      PROJECT_ID,
      SUBJECT_ID,
    ]);
    expect(approvedCanonicalSetQueryKey(PROJECT_ID, SUBJECT_ID)).not.toEqual(
      approvedCanonicalSetQueryKey(PROJECT_ID, otherSubject),
    );
    expect(
      approvedCanonicalSetQueryOptions(PROJECT_ID, SUBJECT_ID).staleTime,
    ).toBe(APPROVED_CANONICAL_SET_STALE_TIME_MS);
  });
});

describe('approvedCanonicalSetQueryOptions', () => {
  it('returns the approved set when the subject has one', async () => {
    const set = buildCanonicalAssetSet({ subjectId: SUBJECT_ID });
    server.use(
      http.get(API_PATH.approvedCanonicalSet(PROJECT_ID, SUBJECT_ID), () =>
        HttpResponse.json(set),
      ),
    );

    await expect(
      buildQueryClient().fetchQuery(
        approvedCanonicalSetQueryOptions(PROJECT_ID, SUBJECT_ID),
      ),
    ).resolves.toEqual(set);
  });

  it('resolves to null, not a rejection, when the subject has no approved set yet', async () => {
    server.use(
      http.get(API_PATH.approvedCanonicalSet(PROJECT_ID, SUBJECT_ID), () =>
        HttpResponse.json(
          {
            statusCode: 404,
            message: `Subject ${SUBJECT_ID} has no approved canonical set yet.`,
            error: 'Not Found',
          },
          { status: 404 },
        ),
      ),
    );

    await expect(
      buildQueryClient().fetchQuery(
        approvedCanonicalSetQueryOptions(PROJECT_ID, SUBJECT_ID),
      ),
    ).resolves.toBeNull();
  });

  it('still rejects a failure that is not a 404', async () => {
    server.use(
      http.get(API_PATH.approvedCanonicalSet(PROJECT_ID, SUBJECT_ID), () =>
        HttpResponse.json(
          { statusCode: 500, message: 'boom' },
          { status: 500 },
        ),
      ),
    );

    await expect(
      buildQueryClient().fetchQuery(
        approvedCanonicalSetQueryOptions(PROJECT_ID, SUBJECT_ID),
      ),
    ).rejects.toMatchObject({ kind: 'HTTP', status: 500 });
  });

  it('refuses an approval state the contract does not define', async () => {
    server.use(
      http.get(API_PATH.approvedCanonicalSet(PROJECT_ID, SUBJECT_ID), () =>
        HttpResponse.json({
          ...buildCanonicalAssetSet({ subjectId: SUBJECT_ID }),
          approvalState: 'FROZEN',
        }),
      ),
    );

    await expect(
      buildQueryClient().fetchQuery(
        approvedCanonicalSetQueryOptions(PROJECT_ID, SUBJECT_ID),
      ),
    ).rejects.toMatchObject({ kind: 'CONTRACT' });
  });
});
