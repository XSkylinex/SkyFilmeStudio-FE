import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import {
  locationIdSchema,
  projectIdSchema,
  updateLocationRequestSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { projectLocationsQueryKey } from '@/features/locations/api/project-locations.query';
import { updateLocationMutationOptions } from '@/features/locations/api/update-location.mutation';
import { buildLocation } from '../../../fixtures/location.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const LOCATION_ID = locationIdSchema.parse(
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
);

const REQUEST = updateLocationRequestSchema.parse({
  layoutNotes: 'Spiral stair rises clockwise after the repair.',
});

const buildQueryClient = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

const buildMutation = (queryClient: QueryClient) =>
  queryClient
    .getMutationCache()
    .build(
      queryClient,
      updateLocationMutationOptions(PROJECT_ID, LOCATION_ID, queryClient),
    );

describe('updateLocationMutationOptions', () => {
  it('patches only the fields it was given, so an untouched field is never overwritten', async () => {
    const updated = buildLocation({
      layoutNotes: 'Spiral stair rises clockwise after the repair.',
    });
    let capturedBody: unknown;
    let capturedMethod = '';

    server.use(
      http.patch(
        API_PATH.location(PROJECT_ID, LOCATION_ID),
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
      layoutNotes: 'Spiral stair rises clockwise after the repair.',
    });
  });

  it('invalidates the location list only after the server answers, never optimistically', async () => {
    const queryClient = buildQueryClient();
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries');
    let release = (): void => {};
    const answered = new Promise<void>((resolve) => {
      release = resolve;
    });

    server.use(
      http.patch(API_PATH.location(PROJECT_ID, LOCATION_ID), async () => {
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
