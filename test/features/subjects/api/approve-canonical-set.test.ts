import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import {
  ERROR_CODE,
  canonicalAssetSetIdSchema,
  projectIdSchema,
  subjectIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { approveCanonicalSetMutationOptions } from '@/features/subjects/api/approve-canonical-set.mutation';
import { approvedCanonicalSetQueryOptions } from '@/features/subjects/api/approved-canonical-set.query';
import { canonicalSetsQueryOptions } from '@/features/subjects/api/canonical-sets.query';
import { buildCanonicalAssetSet } from '../../../fixtures/canonical-asset-set.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const SUBJECT_ID = subjectIdSchema.parse(
  '66666666-6666-4666-8666-666666666666',
);

const SET_ID = canonicalAssetSetIdSchema.parse(
  '77777777-7777-4777-8777-777777777777',
);

const buildQueryClient = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

const buildMutation = (queryClient: QueryClient) =>
  queryClient
    .getMutationCache()
    .build(
      queryClient,
      approveCanonicalSetMutationOptions(PROJECT_ID, SUBJECT_ID, queryClient),
    );

describe('approveCanonicalSetMutationOptions', () => {
  it('sends the approval with no body and no Content-Type header, and resolves to the approved set', async () => {
    const approvedSet = buildCanonicalAssetSet({
      id: SET_ID,
      subjectId: SUBJECT_ID,
      approvalState: 'APPROVED',
    });

    let capturedRequest: Request | undefined;
    server.use(
      http.post(
        API_PATH.approveCanonicalSet(PROJECT_ID, SUBJECT_ID, SET_ID),
        ({ request }) => {
          capturedRequest = request;
          return HttpResponse.json(approvedSet);
        },
      ),
    );

    const queryClient = buildQueryClient();

    await expect(buildMutation(queryClient).execute(SET_ID)).resolves.toEqual(
      approvedSet,
    );

    expect(capturedRequest?.method).toBe('POST');
    expect(capturedRequest?.headers.get('content-type')).toBeNull();
    await expect(capturedRequest?.text()).resolves.toBe('');
  });

  it('does not write the approval into the canonical-sets cache before the server confirms it, nor directly once it does', async () => {
    const draftSet = buildCanonicalAssetSet({
      id: SET_ID,
      subjectId: SUBJECT_ID,
      approvalState: 'PENDING',
    });
    const approvedSet = buildCanonicalAssetSet({
      id: SET_ID,
      subjectId: SUBJECT_ID,
      approvalState: 'APPROVED',
    });

    let resolveResponse: (() => void) | undefined;
    const gate = new Promise<void>((resolve) => {
      resolveResponse = resolve;
    });

    server.use(
      http.post(
        API_PATH.approveCanonicalSet(PROJECT_ID, SUBJECT_ID, SET_ID),
        async () => {
          await gate;
          return HttpResponse.json(approvedSet);
        },
      ),
    );

    const queryClient = buildQueryClient();
    queryClient.setQueryData(
      canonicalSetsQueryOptions(PROJECT_ID, SUBJECT_ID).queryKey,
      [draftSet],
    );

    const pending = buildMutation(queryClient).execute(SET_ID);

    expect(
      queryClient.getQueryData(
        canonicalSetsQueryOptions(PROJECT_ID, SUBJECT_ID).queryKey,
      ),
    ).toEqual([draftSet]);

    await Promise.resolve();
    await Promise.resolve();

    expect(
      queryClient.getQueryData(
        canonicalSetsQueryOptions(PROJECT_ID, SUBJECT_ID).queryKey,
      ),
    ).toEqual([draftSet]);

    resolveResponse?.();
    await expect(pending).resolves.toEqual(approvedSet);

    expect(
      queryClient.getQueryData(
        canonicalSetsQueryOptions(PROJECT_ID, SUBJECT_ID).queryKey,
      ),
    ).toEqual([draftSet]);
  });

  it('invalidates the canonical-sets list and the approved-head query once the server confirms the approval', async () => {
    const draftSet = buildCanonicalAssetSet({
      id: SET_ID,
      subjectId: SUBJECT_ID,
      approvalState: 'PENDING',
    });
    const approvedSet = buildCanonicalAssetSet({
      id: SET_ID,
      subjectId: SUBJECT_ID,
      approvalState: 'APPROVED',
    });

    let listCalls = 0;
    let approvedHeadCalls = 0;
    server.use(
      http.get(API_PATH.canonicalSets(PROJECT_ID, SUBJECT_ID), () => {
        listCalls += 1;
        return HttpResponse.json(listCalls === 1 ? [draftSet] : [approvedSet]);
      }),
      http.get(API_PATH.approvedCanonicalSet(PROJECT_ID, SUBJECT_ID), () => {
        approvedHeadCalls += 1;
        return approvedHeadCalls === 1
          ? HttpResponse.json(
              { statusCode: 404, message: 'no approved set yet' },
              { status: 404 },
            )
          : HttpResponse.json(approvedSet);
      }),
      http.post(
        API_PATH.approveCanonicalSet(PROJECT_ID, SUBJECT_ID, SET_ID),
        () => HttpResponse.json(approvedSet),
      ),
    );

    const queryClient = buildQueryClient();

    await expect(
      queryClient.fetchQuery(canonicalSetsQueryOptions(PROJECT_ID, SUBJECT_ID)),
    ).resolves.toEqual([draftSet]);
    await expect(
      queryClient.fetchQuery(
        approvedCanonicalSetQueryOptions(PROJECT_ID, SUBJECT_ID),
      ),
    ).resolves.toBeNull();

    await buildMutation(queryClient).execute(SET_ID);

    await expect(
      queryClient.fetchQuery(canonicalSetsQueryOptions(PROJECT_ID, SUBJECT_ID)),
    ).resolves.toEqual([approvedSet]);
    await expect(
      queryClient.fetchQuery(
        approvedCanonicalSetQueryOptions(PROJECT_ID, SUBJECT_ID),
      ),
    ).resolves.toEqual(approvedSet);

    expect(listCalls).toBe(2);
    expect(approvedHeadCalls).toBe(2);
  });

  it('rejects with CANONICAL_ANCHOR_REQUIRED when the set has no references at all', async () => {
    server.use(
      http.post(
        API_PATH.approveCanonicalSet(PROJECT_ID, SUBJECT_ID, SET_ID),
        () =>
          HttpResponse.json(
            {
              statusCode: 400,
              code: ERROR_CODE.CANONICAL_ANCHOR_REQUIRED,
              message: 'The set has no references.',
            },
            { status: 400 },
          ),
      ),
    );

    const queryClient = buildQueryClient();

    await expect(
      buildMutation(queryClient).execute(SET_ID),
    ).rejects.toMatchObject({
      kind: 'HTTP',
      code: ERROR_CODE.CANONICAL_ANCHOR_REQUIRED,
      status: 400,
    });
  });

  it('rejects with CANONICAL_SET_IMMUTABLE when the set is already approved', async () => {
    server.use(
      http.post(
        API_PATH.approveCanonicalSet(PROJECT_ID, SUBJECT_ID, SET_ID),
        () =>
          HttpResponse.json(
            {
              statusCode: 409,
              code: ERROR_CODE.CANONICAL_SET_IMMUTABLE,
              message: 'This canonical set is already approved.',
            },
            { status: 409 },
          ),
      ),
    );

    const queryClient = buildQueryClient();

    await expect(
      buildMutation(queryClient).execute(SET_ID),
    ).rejects.toMatchObject({
      kind: 'HTTP',
      code: ERROR_CODE.CANONICAL_SET_IMMUTABLE,
      status: 409,
    });
  });
});
