import { http, HttpResponse } from 'msw';
import { QueryClient } from '@tanstack/react-query';
import { dialogueLineIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { chooseDialogueTierMutationOptions } from '@/features/audio/api/choose-dialogue-tier.mutation';
import { mockOrchestratorServer } from '../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const LINE_ID = dialogueLineIdSchema.parse(
  'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
);

const buildMutation = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return queryClient
    .getMutationCache()
    .build(queryClient, chooseDialogueTierMutationOptions(LINE_ID));
};

describe('chooseDialogueTierMutationOptions', () => {
  it('sends editedAcrossShots even when it is false, because the contract defaults it', async () => {
    let capturedBody: unknown;
    server.use(
      http.post(API_PATH.dialogueLineTier(LINE_ID), async ({ request }) => {
        capturedBody = await request.json();
        return HttpResponse.json({
          dialogueLineId: LINE_ID,
          tier: 'AUDIO_CONDITIONED',
          rationale: 'a speaking subject with a face, rendered from the audio',
        });
      }),
    );

    await buildMutation().execute({ editedAcrossShots: false });

    expect(capturedBody).toEqual({ editedAcrossShots: false });
  });

  it('keeps the rationale, which is the part that explains an automatic choice', async () => {
    server.use(
      http.post(API_PATH.dialogueLineTier(LINE_ID), () =>
        HttpResponse.json({
          dialogueLineId: LINE_ID,
          tier: 'REACTION_EDITING',
          rationale:
            'the line plays across more than one shot, so no single generation has to carry it',
        }),
      ),
    );

    const choice = await buildMutation().execute({ editedAcrossShots: true });

    expect(choice.tier).toBe('REACTION_EDITING');
    expect(choice.rationale).toContain('more than one shot');
  });

  it('surfaces the benchmark gate as a typed code rather than a bare 503', async () => {
    server.use(
      http.post(API_PATH.dialogueLineTier(LINE_ID), () =>
        HttpResponse.json(
          {
            statusCode: 503,
            code: 'TIER_REQUIRES_BENCHMARK',
            message: 'Tier DUBIT is gated behind a hardware benchmark.',
          },
          { status: 503 },
        ),
      ),
    );

    await expect(
      buildMutation().execute({
        requested: 'DUBIT',
        editedAcrossShots: false,
      }),
    ).rejects.toMatchObject({
      kind: 'HTTP',
      code: 'TIER_REQUIRES_BENCHMARK',
    });
  });
});
