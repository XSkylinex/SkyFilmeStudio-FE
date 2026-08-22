import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import { projectIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import {
  projectSubjectsQueryKey,
  projectSubjectsQueryOptions,
} from '@/features/subjects/api/project-subjects.query';
import { PROJECT_SUBJECTS_STALE_TIME_MS } from '@/lib/query/query.constants';
import { buildSubject } from '../../../fixtures/subject.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

describe('projectSubjectsQueryOptions', () => {
  it('keys by project, so two projects never share a cached page', () => {
    const other = projectIdSchema.parse('d3f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e22');

    expect(projectSubjectsQueryKey(PROJECT_ID)).toEqual([
      'project-subjects',
      PROJECT_ID,
    ]);
    expect(projectSubjectsQueryKey(PROJECT_ID)).not.toEqual(
      projectSubjectsQueryKey(other),
    );
    expect(projectSubjectsQueryOptions(PROJECT_ID).staleTime).toBe(
      PROJECT_SUBJECTS_STALE_TIME_MS,
    );
  });

  it('returns the page, carrying its keyset cursor', async () => {
    const page = { items: [buildSubject()], nextCursor: 'eyJpZCI6MX0' };
    server.use(
      http.get(API_PATH.projectSubjects(PROJECT_ID), () =>
        HttpResponse.json(page),
      ),
    );

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    await expect(
      queryClient.fetchQuery(projectSubjectsQueryOptions(PROJECT_ID)),
    ).resolves.toEqual(page);
  });

  it('refuses a subject with no display name', async () => {
    server.use(
      http.get(API_PATH.projectSubjects(PROJECT_ID), () =>
        HttpResponse.json({
          items: [{ ...buildSubject(), displayName: '' }],
        }),
      ),
    );

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    await expect(
      queryClient.fetchQuery(projectSubjectsQueryOptions(PROJECT_ID)),
    ).rejects.toMatchObject({ kind: 'CONTRACT' });
  });
});
