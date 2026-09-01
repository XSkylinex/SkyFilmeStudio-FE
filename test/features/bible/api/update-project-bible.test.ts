import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import {
  ERROR_CODE,
  projectBibleVersionIdSchema,
  projectIdSchema,
} from 'sky-filme-studio-be/contracts';
import type { UpdateProjectBibleRequest } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { activeProjectBibleQueryKey } from '@/features/bible/api/active-project-bible.query';
import { projectBibleMarkdownQueryKey } from '@/features/bible/api/project-bible-markdown.query';
import { projectBiblesQueryKey } from '@/features/bible/api/project-bibles.query';
import { updateProjectBibleMutationOptions } from '@/features/bible/api/update-project-bible.mutation';
import { buildProjectBible } from '../../../fixtures/project-bible.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const BIBLE_ID = projectBibleVersionIdSchema.parse(
  '77777777-7777-4777-8777-777777777777',
);

const PATCH: UpdateProjectBibleRequest = {
  world: {
    tone: 'Restrained',
    contentBoundaries: [],
    recurringThemes: [],
    introOutroRules: [],
    continuityConstraints: [],
  },
};

const buildQueryClient = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

const buildMutation = (queryClient: QueryClient) =>
  queryClient
    .getMutationCache()
    .build(
      queryClient,
      updateProjectBibleMutationOptions(PROJECT_ID, BIBLE_ID, queryClient),
    );

describe('updateProjectBibleMutationOptions', () => {
  it('patches only the sections it was given, leaving every other one untouched', async () => {
    const updated = buildProjectBible({ id: BIBLE_ID });

    let capturedBody: unknown;
    server.use(
      http.patch(
        API_PATH.projectBible(PROJECT_ID, BIBLE_ID),
        async ({ request }) => {
          capturedBody = await request.json();
          return HttpResponse.json(updated);
        },
      ),
    );

    await expect(
      buildMutation(buildQueryClient()).execute(PATCH),
    ).resolves.toEqual(updated);
    expect(capturedBody).toEqual(PATCH);
    expect(capturedBody).not.toHaveProperty('audio');
    expect(capturedBody).not.toHaveProperty('subjectRules');
  });

  it('stales the generated Markdown view as well, because it is derived from the record', async () => {
    const updated = buildProjectBible({ id: BIBLE_ID });

    server.use(
      http.patch(API_PATH.projectBible(PROJECT_ID, BIBLE_ID), () =>
        HttpResponse.json(updated),
      ),
    );

    const queryClient = buildQueryClient();
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries');

    await buildMutation(queryClient).execute(PATCH);

    expect(invalidate).toHaveBeenCalledWith({
      queryKey: projectBiblesQueryKey(PROJECT_ID),
    });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: activeProjectBibleQueryKey(PROJECT_ID),
    });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: projectBibleMarkdownQueryKey(PROJECT_ID, BIBLE_ID),
    });
  });

  it('does not invalidate anything before the server confirms the edit', async () => {
    const updated = buildProjectBible({ id: BIBLE_ID });

    let resolveResponse: (() => void) | undefined;
    const gate = new Promise<void>((resolve) => {
      resolveResponse = resolve;
    });

    server.use(
      http.patch(API_PATH.projectBible(PROJECT_ID, BIBLE_ID), async () => {
        await gate;
        return HttpResponse.json(updated);
      }),
    );

    const queryClient = buildQueryClient();
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries');

    const pending = buildMutation(queryClient).execute(PATCH);
    await Promise.resolve();

    expect(invalidate).not.toHaveBeenCalled();

    resolveResponse?.();
    await expect(pending).resolves.toEqual(updated);
  });

  it('rejects with PROJECT_BIBLE_IMMUTABLE when the version has already been published', async () => {
    server.use(
      http.patch(API_PATH.projectBible(PROJECT_ID, BIBLE_ID), () =>
        HttpResponse.json(
          {
            statusCode: 409,
            code: ERROR_CODE.PROJECT_BIBLE_IMMUTABLE,
            message: 'This project bible is published, so it cannot be edited.',
          },
          { status: 409 },
        ),
      ),
    );

    await expect(
      buildMutation(buildQueryClient()).execute(PATCH),
    ).rejects.toMatchObject({
      kind: 'HTTP',
      code: ERROR_CODE.PROJECT_BIBLE_IMMUTABLE,
      status: 409,
    });
  });
});
