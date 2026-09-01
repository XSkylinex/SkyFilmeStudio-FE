import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import {
  createPropRequestSchema,
  projectIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { createPropMutationOptions } from '@/features/props/api/create-prop.mutation';
import { projectPropsQueryKey } from '@/features/props/api/project-props.query';
import { buildProp } from '../../../fixtures/prop.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const REQUEST = createPropRequestSchema.parse({
  name: 'Brass compass',
  canonicalDescription: 'A dented brass compass with a cracked glass face.',
});

const buildQueryClient = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

describe('createPropMutationOptions', () => {
  it('posts the request as JSON and resolves to the prop the server returns', async () => {
    const created = buildProp({ name: 'Brass compass' });
    let capturedBody: unknown;
    let capturedMethod = '';

    server.use(
      http.post(API_PATH.projectProps(PROJECT_ID), async ({ request }) => {
        capturedMethod = request.method;
        capturedBody = await request.json();

        return HttpResponse.json(created);
      }),
    );

    const queryClient = buildQueryClient();
    const mutation = queryClient
      .getMutationCache()
      .build(queryClient, createPropMutationOptions(PROJECT_ID, queryClient));

    await expect(mutation.execute(REQUEST)).resolves.toEqual(created);
    expect(capturedMethod).toBe('POST');
    expect(capturedBody).toEqual(REQUEST);
  });

  it('invalidates the prop list only after the server answers, never optimistically', async () => {
    const created = buildProp();
    const queryClient = buildQueryClient();
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries');
    let release = (): void => {};
    const answered = new Promise<void>((resolve) => {
      release = resolve;
    });

    server.use(
      http.post(API_PATH.projectProps(PROJECT_ID), async () => {
        await answered;

        return HttpResponse.json(created);
      }),
    );

    const mutation = queryClient
      .getMutationCache()
      .build(queryClient, createPropMutationOptions(PROJECT_ID, queryClient));
    const inFlight = mutation.execute(REQUEST);

    expect(invalidate).not.toHaveBeenCalled();

    release();
    await inFlight;

    expect(invalidate).toHaveBeenCalledWith({
      queryKey: projectPropsQueryKey(PROJECT_ID),
    });
  });
});
