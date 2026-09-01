import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import { ERROR_CODE, projectIdSchema } from 'sky-filme-studio-be/contracts';
import type { CreateProjectBibleRequest } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { activeProjectBibleQueryKey } from '@/features/bible/api/active-project-bible.query';
import { createProjectBibleMutationOptions } from '@/features/bible/api/create-project-bible.mutation';
import { projectBiblesQueryKey } from '@/features/bible/api/project-bibles.query';
import { buildProjectBible } from '../../../fixtures/project-bible.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const REQUEST: CreateProjectBibleRequest = {
  world: {
    genre: 'Documentary',
    contentBoundaries: [],
    recurringThemes: [],
    introOutroRules: [],
    continuityConstraints: [],
  },
  audio: { languages: [], recurringMotifs: [], ambienceRules: [] },
  subjectRules: [],
};

const buildQueryClient = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

const buildMutation = (queryClient: QueryClient) =>
  queryClient
    .getMutationCache()
    .build(
      queryClient,
      createProjectBibleMutationOptions(PROJECT_ID, queryClient),
    );

describe('createProjectBibleMutationOptions', () => {
  it('posts the draft and resolves to the version the server assigned', async () => {
    const created = buildProjectBible({ version: 3 });

    let capturedBody: unknown;
    server.use(
      http.post(API_PATH.projectBibles(PROJECT_ID), async ({ request }) => {
        capturedBody = await request.json();
        return HttpResponse.json(created);
      }),
    );

    const queryClient = buildQueryClient();

    await expect(buildMutation(queryClient).execute(REQUEST)).resolves.toEqual(
      created,
    );
    expect(capturedBody).toEqual(REQUEST);
  });

  it('does not invalidate the list or the active head before the server confirms the draft', async () => {
    const created = buildProjectBible();

    let resolveResponse: (() => void) | undefined;
    const gate = new Promise<void>((resolve) => {
      resolveResponse = resolve;
    });

    server.use(
      http.post(API_PATH.projectBibles(PROJECT_ID), async () => {
        await gate;
        return HttpResponse.json(created);
      }),
    );

    const queryClient = buildQueryClient();
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries');

    const pending = buildMutation(queryClient).execute(REQUEST);
    await Promise.resolve();

    expect(invalidate).not.toHaveBeenCalled();

    resolveResponse?.();
    await expect(pending).resolves.toEqual(created);

    expect(invalidate).toHaveBeenCalledWith({
      queryKey: projectBiblesQueryKey(PROJECT_ID),
    });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: activeProjectBibleQueryKey(PROJECT_ID),
    });
  });

  it('rejects with PROJECT_BIBLE_NARRATIVE_NOT_APPLICABLE when the kind carries no narrative section', async () => {
    server.use(
      http.post(API_PATH.projectBibles(PROJECT_ID), () =>
        HttpResponse.json(
          {
            statusCode: 409,
            code: ERROR_CODE.PROJECT_BIBLE_NARRATIVE_NOT_APPLICABLE,
            message: 'This project kind carries no narrative section.',
          },
          { status: 409 },
        ),
      ),
    );

    await expect(
      buildMutation(buildQueryClient()).execute(REQUEST),
    ).rejects.toMatchObject({
      kind: 'HTTP',
      code: ERROR_CODE.PROJECT_BIBLE_NARRATIVE_NOT_APPLICABLE,
    });
  });
});
