import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import {
  projectIdSchema,
  propIdSchema,
  updatePropRequestSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { projectPropsQueryKey } from '@/features/props/api/project-props.query';
import { updatePropMutationOptions } from '@/features/props/api/update-prop.mutation';
import { buildProp } from '../../../fixtures/prop.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const PROP_ID = propIdSchema.parse('dddddddd-dddd-4ddd-8ddd-dddddddddddd');

const REQUEST = updatePropRequestSchema.parse({
  canonicalDescription: 'A dented brass compass, glass now missing.',
});

const buildQueryClient = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

const buildMutation = (queryClient: QueryClient) =>
  queryClient
    .getMutationCache()
    .build(
      queryClient,
      updatePropMutationOptions(PROJECT_ID, PROP_ID, queryClient),
    );

describe('updatePropMutationOptions', () => {
  it('patches only the fields it was given, so an untouched field is never overwritten', async () => {
    const updated = buildProp({
      canonicalDescription: 'A dented brass compass, glass now missing.',
    });
    let capturedBody: unknown;
    let capturedMethod = '';

    server.use(
      http.patch(
        API_PATH.projectProp(PROJECT_ID, PROP_ID),
        async ({ request }) => {
          capturedMethod = request.method;
          capturedBody = await request.json();

          return HttpResponse.json(updated);
        },
      ),
    );

    const queryClient = buildQueryClient();

    await expect(buildMutation(queryClient).execute(REQUEST)).resolves.toEqual(
      updated,
    );
    expect(capturedMethod).toBe('PATCH');
    expect(capturedBody).toEqual({
      canonicalDescription: 'A dented brass compass, glass now missing.',
    });
  });

  it('invalidates the prop list only after the server answers, never optimistically', async () => {
    const queryClient = buildQueryClient();
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries');
    let release = (): void => {};
    const answered = new Promise<void>((resolve) => {
      release = resolve;
    });

    server.use(
      http.patch(API_PATH.projectProp(PROJECT_ID, PROP_ID), async () => {
        await answered;

        return HttpResponse.json(buildProp());
      }),
    );

    const inFlight = buildMutation(queryClient).execute(REQUEST);

    expect(invalidate).not.toHaveBeenCalled();

    release();
    await inFlight;

    expect(invalidate).toHaveBeenCalledWith({
      queryKey: projectPropsQueryKey(PROJECT_ID),
    });
  });
});
