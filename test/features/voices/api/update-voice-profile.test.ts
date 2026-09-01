import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import {
  projectIdSchema,
  updateVoiceProfileRequestSchema,
  voiceProfileIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { updateVoiceProfileMutationOptions } from '@/features/voices/api/update-voice-profile.mutation';
import { voiceProfilesQueryKey } from '@/features/voices/api/voice-profiles.query';
import { buildVoiceProfile } from '../../../fixtures/voice-profile.fixture';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const VOICE_ID = voiceProfileIdSchema.parse(
  '99999999-9999-4999-8999-999999999999',
);

const REQUEST = updateVoiceProfileRequestSchema.parse({
  displayName: 'Mira (warmer)',
});

const buildQueryClient = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

const buildMutation = (queryClient: QueryClient) =>
  queryClient
    .getMutationCache()
    .build(
      queryClient,
      updateVoiceProfileMutationOptions(PROJECT_ID, VOICE_ID, queryClient),
    );

describe('updateVoiceProfileMutationOptions', () => {
  it('patches only the fields it was given, so an untouched field is never overwritten', async () => {
    const updated = buildVoiceProfile({ displayName: 'Mira (warmer)' });
    let capturedBody: unknown;
    let capturedMethod = '';

    server.use(
      http.patch(
        API_PATH.voiceProfile(PROJECT_ID, VOICE_ID),
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
    expect(capturedBody).toEqual({ displayName: 'Mira (warmer)' });
  });

  it('invalidates the voice list only after the server answers, never optimistically', async () => {
    const queryClient = buildQueryClient();
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries');
    let release = (): void => {};
    const answered = new Promise<void>((resolve) => {
      release = resolve;
    });

    server.use(
      http.patch(API_PATH.voiceProfile(PROJECT_ID, VOICE_ID), async () => {
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
