import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  musicCueIdSchema,
  productionIdSchema,
  projectIdSchema,
  sceneCueIdSchema,
  sceneIdSchema,
} from 'sky-filme-studio-be/contracts';
import type { SceneCue } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { SceneScore } from '@/features/audio/components/scene-score';
import { buildMusicCue } from '../../../../fixtures/music-cue.fixture';
import { renderInApp } from '../../../../render-in-app';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);
const PRODUCTION_ID = productionIdSchema.parse(
  '33333333-3333-4333-8333-333333333333',
);
const SCENE_ID = sceneIdSchema.parse('44444444-4444-4444-8444-444444444444');
const CUE_ID = musicCueIdSchema.parse('88888888-8888-4888-8888-888888888888');
const MISSING_CUE_ID = musicCueIdSchema.parse(
  '99999999-8888-4888-8888-888888888888',
);

const placement = (overrides: Partial<SceneCue> = {}): SceneCue => ({
  id: sceneCueIdSchema.parse('eeeeeeee-1111-4eee-8eee-eeeeeeeeeeee'),
  sceneId: SCENE_ID,
  musicCueId: CUE_ID,
  order: 0,
  startOffsetMs: 2_000,
  gainDb: -6,
  loop: true,
  fadeInMs: 500,
  fadeOutMs: 1_500,
  ...overrides,
});

const server = mockOrchestratorServer(
  http.get(API_PATH.musicCues(PROJECT_ID), () =>
    HttpResponse.json({ items: [buildMusicCue({ id: CUE_ID, name: 'Night market' })] }),
  ),
);

const serves = (cues: readonly SceneCue[]): void => {
  server.use(
    http.get(API_PATH.sceneCues(SCENE_ID), () => HttpResponse.json(cues)),
  );
};

const recordSaves = (): unknown[] => {
  const sent: unknown[] = [];

  server.use(
    http.put(API_PATH.sceneCues(SCENE_ID), async ({ request }) => {
      sent.push(await request.json());
      return HttpResponse.json([]);
    }),
  );

  return sent;
};

const render = (): void => {
  renderInApp(
    <SceneScore
      projectId={PROJECT_ID}
      productionId={PRODUCTION_ID}
      sceneId={SCENE_ID}
    />,
  );
};

describe('SceneScore', () => {
  it('names the cue placed on this scene, from the project’s soundtrack library', async () => {
    serves([placement()]);
    render();

    expect(await screen.findByLabelText('Cue')).toHaveValue(CUE_ID);
    expect(
      screen.getByRole('option', { name: 'Night market' }),
    ).toBeInTheDocument();
  });

  it('shows the placement as the numbers the mix will use', async () => {
    serves([placement()]);
    render();

    expect(await screen.findByLabelText('Starts at (ms)')).toHaveValue(2000);
    expect(screen.getByLabelText('Gain (dB)')).toHaveValue(-6);
    expect(screen.getByLabelText('Fade in (ms)')).toHaveValue(500);
    expect(screen.getByLabelText('Fade out (ms)')).toHaveValue(1500);
    expect(screen.getByLabelText('Loops')).toHaveValue('yes');
  });

  it('says no cue is assigned rather than showing an empty list', async () => {
    serves([]);
    render();

    expect(
      await screen.findByText(/No cue is assigned to this scene/),
    ).toBeInTheDocument();
  });

  it('keeps a cue the library no longer lists selectable, so saving cannot blank it', async () => {
    const user = userEvent.setup();
    const sent = recordSaves();
    serves([placement({ musicCueId: MISSING_CUE_ID })]);
    render();

    expect(await screen.findByLabelText('Cue')).toHaveValue(MISSING_CUE_ID);

    await user.type(screen.getByLabelText('Gain (dB)'), '{Backspace}9');
    await user.click(screen.getByRole('button', { name: 'Save the placements' }));

    expect(await screen.findByText('The placements were saved.')).toBeInTheDocument();
    expect(sent).toStrictEqual([
      {
        cues: [
          {
            musicCueId: MISSING_CUE_ID,
            order: 0,
            startOffsetMs: 2000,
            gainDb: -9,
            loop: true,
            fadeInMs: 500,
            fadeOutMs: 1500,
          },
        ],
      },
    ]);
  });

  it('numbers every placement by its position, not by anything a person types', async () => {
    const user = userEvent.setup();
    const sent = recordSaves();
    serves([
      placement({ order: 0 }),
      placement({
        id: sceneCueIdSchema.parse('eeeeeeee-2222-4eee-8eee-eeeeeeeeeeee'),
        order: 1,
        startOffsetMs: 9_000,
      }),
    ]);
    render();

    const gains = await screen.findAllByLabelText('Gain (dB)');
    await user.type(gains[1] as HTMLElement, '{Backspace}3');
    await user.click(screen.getByRole('button', { name: 'Save the placements' }));

    expect(await screen.findByText('The placements were saved.')).toBeInTheDocument();
    expect(sent).toStrictEqual([
      {
        cues: [
          {
            musicCueId: CUE_ID,
            order: 0,
            startOffsetMs: 2000,
            gainDb: -6,
            loop: true,
            fadeInMs: 500,
            fadeOutMs: 1500,
          },
          {
            musicCueId: CUE_ID,
            order: 1,
            startOffsetMs: 9000,
            gainDb: -3,
            loop: true,
            fadeInMs: 500,
            fadeOutMs: 1500,
          },
        ],
      },
    ]);
  });

  it('sends only the placements left after a removal, renumbered from the top', async () => {
    const user = userEvent.setup();
    const sent = recordSaves();
    serves([
      placement({ order: 0 }),
      placement({
        id: sceneCueIdSchema.parse('eeeeeeee-2222-4eee-8eee-eeeeeeeeeeee'),
        order: 1,
        startOffsetMs: 9_000,
      }),
    ]);
    render();

    const remove = await screen.findAllByRole('button', { name: /^Remove/ });
    await user.click(remove[0] as HTMLElement);
    await user.click(screen.getByRole('button', { name: 'Save the placements' }));

    expect(await screen.findByText('The placements were saved.')).toBeInTheDocument();
    expect(sent).toStrictEqual([
      {
        cues: [
          {
            musicCueId: CUE_ID,
            order: 0,
            startOffsetMs: 9000,
            gainDb: -6,
            loop: true,
            fadeInMs: 500,
            fadeOutMs: 1500,
          },
        ],
      },
    ]);
  });
});
