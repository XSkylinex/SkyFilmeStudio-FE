import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import {
  ERROR_CODE,
  projectBibleVersionIdSchema,
  projectIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { activeProjectBibleQueryKey } from '@/features/bible/api/active-project-bible.query';
import { projectBiblesQueryKey } from '@/features/bible/api/project-bibles.query';
import { publishProjectBibleMutationOptions } from '@/features/bible/api/publish-project-bible.mutation';
import { buildProjectBible } from '../../../fixtures/project-bible.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const BIBLE_ID = projectBibleVersionIdSchema.parse(
  '77777777-7777-4777-8777-777777777777',
);

const buildQueryClient = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

const buildMutation = (queryClient: QueryClient) =>
  queryClient
    .getMutationCache()
    .build(
      queryClient,
      publishProjectBibleMutationOptions(PROJECT_ID, queryClient),
    );

describe('publishProjectBibleMutationOptions', () => {
  it('sends the publish with no body and no Content-Type header, and resolves to the published bible', async () => {
    const published = buildProjectBible({
      id: BIBLE_ID,
      published: true,
      publishedAt: '2026-08-22T00:00:00.000Z',
    });

    let capturedRequest: Request | undefined;
    server.use(
      http.post(
        API_PATH.publishProjectBible(PROJECT_ID, BIBLE_ID),
        ({ request }) => {
          capturedRequest = request;
          return HttpResponse.json(published);
        },
      ),
    );

    const queryClient = buildQueryClient();

    await expect(buildMutation(queryClient).execute(BIBLE_ID)).resolves.toEqual(
      published,
    );

    expect(capturedRequest?.method).toBe('POST');
    expect(capturedRequest?.headers.get('content-type')).toBeNull();
    await expect(capturedRequest?.text()).resolves.toBe('');
  });

  it('does not invalidate the list or the active head before the server confirms the publish', async () => {
    const published = buildProjectBible({
      id: BIBLE_ID,
      published: true,
      publishedAt: '2026-08-22T00:00:00.000Z',
    });

    let resolveResponse: (() => void) | undefined;
    const gate = new Promise<void>((resolve) => {
      resolveResponse = resolve;
    });

    server.use(
      http.post(
        API_PATH.publishProjectBible(PROJECT_ID, BIBLE_ID),
        async () => {
          await gate;
          return HttpResponse.json(published);
        },
      ),
    );

    const queryClient = buildQueryClient();
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries');

    const pending = buildMutation(queryClient).execute(BIBLE_ID);
    await Promise.resolve();

    expect(invalidate).not.toHaveBeenCalled();

    resolveResponse?.();
    await expect(pending).resolves.toEqual(published);

    expect(invalidate).toHaveBeenCalledWith({
      queryKey: projectBiblesQueryKey(PROJECT_ID),
    });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: activeProjectBibleQueryKey(PROJECT_ID),
    });
  });

  it('rejects with PROJECT_BIBLE_IMMUTABLE when the version cannot be published again', async () => {
    server.use(
      http.post(API_PATH.publishProjectBible(PROJECT_ID, BIBLE_ID), () =>
        HttpResponse.json(
          {
            statusCode: 409,
            code: ERROR_CODE.PROJECT_BIBLE_IMMUTABLE,
            message: 'This project bible has already been published.',
          },
          { status: 409 },
        ),
      ),
    );

    const queryClient = buildQueryClient();

    await expect(
      buildMutation(queryClient).execute(BIBLE_ID),
    ).rejects.toMatchObject({
      kind: 'HTTP',
      code: ERROR_CODE.PROJECT_BIBLE_IMMUTABLE,
      status: 409,
    });
  });
});
