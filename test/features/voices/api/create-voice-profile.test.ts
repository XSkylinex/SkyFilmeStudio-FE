import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import {
  createVoiceProfileRequestSchema,
  projectIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { createVoiceProfileMutationOptions } from '@/features/voices/api/create-voice-profile.mutation';
import { voiceProfilesQueryKey } from '@/features/voices/api/voice-profiles.query';
import { buildVoiceProfile } from '../../../fixtures/voice-profile.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const REQUEST = createVoiceProfileRequestSchema.parse({
  displayName: 'Mira',
  engine: 'moss-tts',
  modelId: 'moss-ttsd-v0.5',
  language: 'en-GB',
});

const buildQueryClient = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

const buildMutation = (queryClient: QueryClient) =>
  queryClient
    .getMutationCache()
    .build(
      queryClient,
      createVoiceProfileMutationOptions(PROJECT_ID, queryClient),
    );

describe('createVoiceProfileMutationOptions', () => {
  it('posts the request as JSON and resolves to the voice the server returns', async () => {
    const created = buildVoiceProfile();
    let capturedBody: unknown;
    let capturedMethod = '';

    server.use(
      http.post(API_PATH.voiceProfiles(PROJECT_ID), async ({ request }) => {
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

  it('invalidates the voice list only after the server answers, never optimistically', async () => {
    const queryClient = buildQueryClient();
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries');
    let release = (): void => {};
    const answered = new Promise<void>((resolve) => {
      release = resolve;
    });

    server.use(
      http.post(API_PATH.voiceProfiles(PROJECT_ID), async () => {
        await answered;

        return HttpResponse.json(buildVoiceProfile());
      }),
    );

    const inFlight = buildMutation(queryClient).execute(REQUEST);

    expect(invalidate).not.toHaveBeenCalled();

    release();
    await inFlight;

    expect(invalidate).toHaveBeenCalledWith({
      queryKey: voiceProfilesQueryKey(PROJECT_ID),
    });
  });
});
