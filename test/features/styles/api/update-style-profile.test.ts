import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import {
  projectIdSchema,
  styleProfileIdSchema,
  updateStyleProfileRequestSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { styleProfileVersionsQueryKey } from '@/features/styles/api/style-profile-versions.query';
import { styleProfilesQueryKey } from '@/features/styles/api/style-profiles.query';
import { updateStyleProfileMutationOptions } from '@/features/styles/api/update-style-profile.mutation';
import { buildStyleProfile } from '../../../fixtures/style-profile.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const LINEAGE_ID = styleProfileIdSchema.parse(
  '11111111-1111-4111-8111-111111111111',
);

const REQUEST = updateStyleProfileRequestSchema.parse({
  description: 'Cold key light, longer lenses.',
});

const buildQueryClient = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

const buildMutation = (queryClient: QueryClient) =>
  queryClient
    .getMutationCache()
    .build(
      queryClient,
      updateStyleProfileMutationOptions(
        PROJECT_ID,
        LINEAGE_ID,
        LINEAGE_ID,
        queryClient,
      ),
    );

describe('updateStyleProfileMutationOptions', () => {
  it('patches the version in place rather than creating one, which is why it is only ever offered on a draft', async () => {
    const edited = buildStyleProfile({
      description: 'Cold key light, longer lenses.',
      version: 1,
    });
    let capturedBody: unknown;
    let capturedMethod = '';

    server.use(
      http.patch(
        API_PATH.styleProfile(PROJECT_ID, LINEAGE_ID),
        async ({ request }) => {
          capturedMethod = request.method;
          capturedBody = await request.json();

          return HttpResponse.json(edited);
        },
      ),
    );

    const queryClient = buildQueryClient();
    const result = await buildMutation(queryClient).execute(REQUEST);

    expect(capturedMethod).toBe('PATCH');
    expect(capturedBody).toEqual({
      description: 'Cold key light, longer lenses.',
    });
    expect(result.version).toBe(1);
  });

  it('invalidates both the list and the lineage, so an edited version cannot linger in the version strip', async () => {
    const queryClient = buildQueryClient();
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries');
    let release = (): void => {};
    const answered = new Promise<void>((resolve) => {
      release = resolve;
    });

    server.use(
      http.patch(API_PATH.styleProfile(PROJECT_ID, LINEAGE_ID), async () => {
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
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: styleProfileVersionsQueryKey(PROJECT_ID, LINEAGE_ID),
    });
  });
});
