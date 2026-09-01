import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import {
  createStyleProfileRequestSchema,
  projectIdSchema,
  styleProfileIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { createStyleProfileMutationOptions } from '@/features/styles/api/create-style-profile.mutation';
import { styleProfilesQueryKey } from '@/features/styles/api/style-profiles.query';
import { buildStyleProfile } from '../../../fixtures/style-profile.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const LINEAGE_ID = styleProfileIdSchema.parse(
  '11111111-1111-4111-8111-111111111111',
);

const REQUEST = createStyleProfileRequestSchema.parse({
  name: 'Nightfall',
  description: 'Cold key light, long lenses.',
  mode: 'TEST_MODE',
});

const buildQueryClient = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

const buildMutation = (queryClient: QueryClient) =>
  queryClient
    .getMutationCache()
    .build(
      queryClient,
      createStyleProfileMutationOptions(PROJECT_ID, queryClient),
    );

describe('createStyleProfileMutationOptions', () => {
  it('posts the request as JSON and resolves to the profile the server returns', async () => {
    const created = buildStyleProfile();
    let capturedBody: unknown;
    let capturedMethod = '';

    server.use(
      http.post(API_PATH.styleProfiles(PROJECT_ID), async ({ request }) => {
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

  it('carries a lineageId through untouched, because that is what makes the next version rather than a new lineage', async () => {
    const nextVersion = buildStyleProfile({
      id: styleProfileIdSchema.parse('22222222-2222-4222-8222-222222222222'),
      lineageId: LINEAGE_ID,
      version: 2,
    });
    const request = createStyleProfileRequestSchema.parse({
      name: 'Nightfall',
      description: 'Cold key light, longer lenses.',
      mode: 'TEST_MODE',
      lineageId: LINEAGE_ID,
    });
    let capturedBody: Record<string, unknown> = {};

    server.use(
      http.post(
        API_PATH.styleProfiles(PROJECT_ID),
        async ({ request: sent }) => {
          capturedBody = (await sent.json()) as Record<string, unknown>;

          return HttpResponse.json(nextVersion);
        },
      ),
    );

    const queryClient = buildQueryClient();
    const result = await buildMutation(queryClient).execute(request);

    expect(capturedBody['lineageId']).toBe(LINEAGE_ID);
    expect(result.lineageId).toBe(LINEAGE_ID);
    expect(result.version).toBe(2);
  });

  it('invalidates the profile list only after the server answers, never optimistically', async () => {
    const queryClient = buildQueryClient();
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries');
    let release = (): void => {};
    const answered = new Promise<void>((resolve) => {
      release = resolve;
    });

    server.use(
      http.post(API_PATH.styleProfiles(PROJECT_ID), async () => {
        await answered;

        return HttpResponse.json(buildStyleProfile());
      }),
    );

    const inFlight = buildMutation(queryClient).execute(REQUEST);

    expect(invalidate).not.toHaveBeenCalled();

    release();
    await inFlight;

    expect(invalidate).toHaveBeenCalledWith({
      queryKey: styleProfilesQueryKey(PROJECT_ID),
    });
  });
});
