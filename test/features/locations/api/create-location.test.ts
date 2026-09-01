import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import {
  createLocationRequestSchema,
  projectIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { createLocationMutationOptions } from '@/features/locations/api/create-location.mutation';
import { projectLocationsQueryKey } from '@/features/locations/api/project-locations.query';
import { buildLocation } from '../../../fixtures/location.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const REQUEST = createLocationRequestSchema.parse({
  name: 'The lighthouse',
  canonicalDescription: 'A stone lighthouse on a basalt shelf.',
  layoutNotes: 'Spiral stair rises anticlockwise.',
});

const buildQueryClient = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

const buildMutation = (queryClient: QueryClient) =>
  queryClient
    .getMutationCache()
    .build(queryClient, createLocationMutationOptions(PROJECT_ID, queryClient));

describe('createLocationMutationOptions', () => {
  it('posts the request as JSON and resolves to the location the server returns', async () => {
    const created = buildLocation();
    let capturedBody: unknown;
    let capturedMethod = '';

    server.use(
      http.post(API_PATH.locations(PROJECT_ID), async ({ request }) => {
        capturedMethod = request.method;
        capturedBody = await request.json();

        return HttpResponse.json(created);
      }),
    );

    const queryClient = buildQueryClient();

    await expect(buildMutation(queryClient).execute(REQUEST)).resolves.toEqual(
      created,
    );
    expect(capturedMethod).toBe('POST');
    expect(capturedBody).toEqual(REQUEST);
  });

  it('invalidates the location list only after the server answers, never optimistically', async () => {
    const queryClient = buildQueryClient();
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries');
    let release = (): void => {};
    const answered = new Promise<void>((resolve) => {
      release = resolve;
    });

    server.use(
      http.post(API_PATH.locations(PROJECT_ID), async () => {
        await answered;

        return HttpResponse.json(buildLocation());
      }),
    );

    const inFlight = buildMutation(queryClient).execute(REQUEST);

    expect(invalidate).not.toHaveBeenCalled();

    release();
    await inFlight;

    expect(invalidate).toHaveBeenCalledWith({
      queryKey: projectLocationsQueryKey(PROJECT_ID),
    });
  });
});
