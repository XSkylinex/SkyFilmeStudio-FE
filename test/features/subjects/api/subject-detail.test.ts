import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import {
  projectIdSchema,
  subjectIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import {
  subjectDetailQueryKey,
  subjectDetailQueryOptions,
} from '@/features/subjects/api/subject-detail.query';
import { SUBJECT_DETAIL_STALE_TIME_MS } from '@/lib/query/query.constants';
import { buildSubject } from '../../../fixtures/subject.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const SUBJECT_ID = subjectIdSchema.parse(
  '66666666-6666-4666-8666-666666666666',
);

describe('subjectDetailQueryKey', () => {
  it('keys by project and subject, so two subjects never share a cached entry', () => {
    const otherSubject = subjectIdSchema.parse(
      '99999999-9999-4999-8999-999999999999',
    );

    expect(subjectDetailQueryKey(PROJECT_ID, SUBJECT_ID)).toEqual([
      'subject-detail',
      PROJECT_ID,
      SUBJECT_ID,
    ]);
    expect(subjectDetailQueryKey(PROJECT_ID, SUBJECT_ID)).not.toEqual(
      subjectDetailQueryKey(PROJECT_ID, otherSubject),
    );
  });
});

describe('subjectDetailQueryOptions', () => {
  it('treats an editable subject as stale sooner than an immutable asset', () => {
    expect(subjectDetailQueryOptions(PROJECT_ID, SUBJECT_ID).staleTime).toBe(
      SUBJECT_DETAIL_STALE_TIME_MS,
    );
    expect(Number.isFinite(SUBJECT_DETAIL_STALE_TIME_MS)).toBe(true);
  });

  it('fetches from the single-subject path and returns the parsed subject', async () => {
    const subject = buildSubject({ id: SUBJECT_ID, projectId: PROJECT_ID });
    server.use(
      http.get(API_PATH.projectSubject(PROJECT_ID, SUBJECT_ID), () =>
        HttpResponse.json(subject),
      ),
    );

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    await expect(
      queryClient.fetchQuery(subjectDetailQueryOptions(PROJECT_ID, SUBJECT_ID)),
    ).resolves.toEqual(subject);
  });

  it('refuses a subject with no display name', async () => {
    server.use(
      http.get(API_PATH.projectSubject(PROJECT_ID, SUBJECT_ID), () =>
        HttpResponse.json({
          ...buildSubject({ id: SUBJECT_ID, projectId: PROJECT_ID }),
          displayName: '',
        }),
      ),
    );

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    await expect(
      queryClient.fetchQuery(subjectDetailQueryOptions(PROJECT_ID, SUBJECT_ID)),
    ).rejects.toMatchObject({ kind: 'CONTRACT' });
  });
});
