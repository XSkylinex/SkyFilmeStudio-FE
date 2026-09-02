import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
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
const OTHER_SCENE_ID = sceneIdSchema.parse(
  '66666666-6666-4666-8666-666666666666',
);
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
    HttpResponse.json({ items: [buildMusicCue({ id: CUE_ID })] }),
  ),
);

const serves = (cues: readonly SceneCue[]): void => {
  server.use(
    http.get(API_PATH.productionScore(PRODUCTION_ID), () =>
      HttpResponse.json(cues),
    ),
  );
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

    expect(await screen.findByText('Opening theme')).toBeInTheDocument();
    expect(screen.queryByText(CUE_ID)).not.toBeInTheDocument();
  });

  it('shows the placement as the numbers the mix will use', async () => {
    serves([placement()]);

    render();

    expect(await screen.findByText('-6 dB')).toBeInTheDocument();
    expect(screen.getByText('0.50 s in, 1.50 s out')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });

  it('says no cue is assigned rather than showing an empty list', async () => {
    serves([placement({ sceneId: OTHER_SCENE_ID })]);

    render();

    expect(
      await screen.findByText('No cue is assigned to this scene.'),
    ).toBeInTheDocument();
  });

  it('says a cue the library no longer returns is unknown rather than showing its id', async () => {
    serves([placement({ musicCueId: MISSING_CUE_ID })]);

    render();

    expect(
      await screen.findByText(/may have been removed since the score was made/),
    ).toBeInTheDocument();
    expect(screen.queryByText(MISSING_CUE_ID)).not.toBeInTheDocument();
  });
});
