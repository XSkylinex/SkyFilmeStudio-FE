import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import {
  canonicalAssetSetIdSchema,
  projectIdSchema,
  subjectIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import {
  canonicalReferencesQueryKey,
  canonicalReferencesQueryOptions,
} from '@/features/subjects/api/canonical-references.query';
import { CANONICAL_REFERENCES_STALE_TIME_MS } from '@/lib/query/query.constants';
import { buildCanonicalReference } from '../../../fixtures/canonical-reference.fixture';
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

describe('canonicalReferencesQueryKey', () => {
  it('keys by project, subject and set, so two sets never share a cached list', () => {
    const otherSet = canonicalAssetSetIdSchema.parse(
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    );

    expect(canonicalReferencesQueryKey(PROJECT_ID, SUBJECT_ID, SET_ID)).toEqual(
      ['canonical-references', PROJECT_ID, SUBJECT_ID, SET_ID],
    );
    expect(
      canonicalReferencesQueryKey(PROJECT_ID, SUBJECT_ID, SET_ID),
    ).not.toEqual(
      canonicalReferencesQueryKey(PROJECT_ID, SUBJECT_ID, otherSet),
    );
    expect(
      canonicalReferencesQueryOptions(PROJECT_ID, SUBJECT_ID, SET_ID).staleTime,
    ).toBe(CANONICAL_REFERENCES_STALE_TIME_MS);
  });
});

describe('canonicalReferencesQueryOptions', () => {
  it('parses the bare array the endpoint returns, not a paginated envelope', async () => {
    const references = [buildCanonicalReference()];
    server.use(
      http.get(
        API_PATH.canonicalReferences(PROJECT_ID, SUBJECT_ID, SET_ID),
        () => HttpResponse.json(references),
      ),
    );

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    await expect(
      queryClient.fetchQuery(
        canonicalReferencesQueryOptions(PROJECT_ID, SUBJECT_ID, SET_ID),
      ),
    ).resolves.toEqual(references);
  });

  it('refuses a reference naming both a source asset and an artifact', async () => {
    server.use(
      http.get(
        API_PATH.canonicalReferences(PROJECT_ID, SUBJECT_ID, SET_ID),
        () =>
          HttpResponse.json([
            {
              ...buildCanonicalReference(),
              artifactId: '22222222-2222-4222-8222-222222222222',
            },
          ]),
      ),
    );

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    await expect(
      queryClient.fetchQuery(
        canonicalReferencesQueryOptions(PROJECT_ID, SUBJECT_ID, SET_ID),
      ),
    ).rejects.toMatchObject({ kind: 'CONTRACT' });
  });
});
