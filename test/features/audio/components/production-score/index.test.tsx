import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  musicCueIdSchema,
  productionIdSchema,
  sceneCueIdSchema,
  sceneIdSchema,
} from 'sky-filme-studio-be/contracts';
import type { SceneCue } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { ProductionScore } from '@/features/audio/components/production-score';
import { renderInApp } from '../../../../render-in-app';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const PRODUCTION_ID = productionIdSchema.parse(
  '33333333-3333-4333-8333-333333333333',
);

const cue: SceneCue = {
  id: sceneCueIdSchema.parse('eeeeeeee-1111-4eee-8eee-eeeeeeeeeeee'),
  sceneId: sceneIdSchema.parse('44444444-4444-4444-8444-444444444444'),
  musicCueId: musicCueIdSchema.parse('88888888-8888-4888-8888-888888888888'),
  order: 0,
  startOffsetMs: 0,
  gainDb: -6,
  loop: false,
  fadeInMs: 500,
  fadeOutMs: 500,
};

const server = mockOrchestratorServer();

const serves = (cues: readonly SceneCue[]): void => {
  server.use(
    http.get(API_PATH.productionScore(PRODUCTION_ID), () =>
      HttpResponse.json(cues),
    ),
  );
};

const render = (): void => {
  renderInApp(<ProductionScore productionId={PRODUCTION_ID} />);
};

describe('ProductionScore', () => {
  it('says the production has no score rather than showing an empty count', async () => {
    serves([]);

    render();

    expect(
      await screen.findByText(/This production has no score yet/),
    ).toBeInTheDocument();
  });

  it('counts the cues a score assigned', async () => {
    serves([cue]);

    render();

    expect(await screen.findByText('Cues assigned: 1')).toBeInTheDocument();
  });

  it('scores with no brief and no cap, sending an empty body the contract accepts', async () => {
    const user = userEvent.setup();
    serves([]);
    let posted: unknown;
    server.use(
      http.post(
        API_PATH.productionScore(PRODUCTION_ID),
        async ({ request }) => {
          posted = await request.json();
          return HttpResponse.json([cue]);
        },
      ),
    );

    render();

    await user.click(
      await screen.findByRole('button', { name: 'Score this production' }),
    );

    await waitFor(() => {
      expect(posted).toBeDefined();
    });
    expect(posted).toStrictEqual({});
  });

  it('sends the brief and the variety cap when they are given', async () => {
    const user = userEvent.setup();
    serves([]);
    let posted: unknown;
    server.use(
      http.post(
        API_PATH.productionScore(PRODUCTION_ID),
        async ({ request }) => {
          posted = await request.json();
          return HttpResponse.json([cue]);
        },
      ),
    );

    render();

    await user.type(await screen.findByLabelText('Brief'), 'Restrained');
    await user.type(
      screen.getByLabelText(/Most of the production one cue may cover/),
      '0.5',
    );
    await user.click(
      screen.getByRole('button', { name: 'Score this production' }),
    );

    await waitFor(() => {
      expect(posted).toBeDefined();
    });
    expect(posted).toStrictEqual({
      brief: 'Restrained',
      musicCueVarietyMaxProportion: 0.5,
    });
  });

  it('shows the refusal when one cue would cover too much of the production', async () => {
    const user = userEvent.setup();
    serves([]);
    server.use(
      http.post(API_PATH.productionScore(PRODUCTION_ID), () =>
        HttpResponse.json(
          {
            statusCode: 409,
            code: 'MUSIC_CUE_VARIETY_OVERUSED',
            message: 'one cue would cover too much',
          },
          { status: 409 },
        ),
      ),
    );

    render();

    await user.click(
      await screen.findByRole('button', { name: 'Score this production' }),
    );

    expect(
      await screen.findByText('The production was not scored'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/as often as the production’s variety rule allows/),
    ).toBeInTheDocument();
  });

  it('refuses a cap the contract will not take, on its own field', async () => {
    const user = userEvent.setup();
    serves([]);
    let posted: unknown;
    server.use(
      http.post(
        API_PATH.productionScore(PRODUCTION_ID),
        async ({ request }) => {
          posted = await request.json();
          return HttpResponse.json([]);
        },
      ),
    );

    render();

    await user.type(
      await screen.findByLabelText(/Most of the production one cue may cover/),
      '2',
    );
    await user.click(
      screen.getByRole('button', { name: 'Score this production' }),
    );

    expect(
      await screen.findByText(/Fields needing attention/),
    ).toBeInTheDocument();
    expect(posted).toBeUndefined();
  });
});
