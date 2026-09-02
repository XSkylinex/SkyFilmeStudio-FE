import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { API_PATH } from '@/lib/api/api.constants';
import { SceneMix } from '@/features/audio/components/scene-mix';
import { buildScene } from '../../../../fixtures/scene.fixture';
import { buildSceneMix } from '../../../../fixtures/mix.fixture';
import { renderInApp } from '../../../../render-in-app';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const scene = buildScene({ order: 1 });
const server = mockOrchestratorServer(
  http.get('/productions/:productionId/score', () => HttpResponse.json([])),
  http.get('/projects/:projectId/music-cues', () =>
    HttpResponse.json({ items: [] }),
  ),
);

const serves = (mixes: readonly ReturnType<typeof buildSceneMix>[]): void => {
  server.use(
    http.get(API_PATH.sceneMixes(scene.id), () => HttpResponse.json(mixes)),
  );
};

const render = (): void => {
  renderInApp(<SceneMix scene={scene} />);
};

describe('SceneMix', () => {
  it('says the scene has not been mixed rather than showing an empty record', async () => {
    serves([]);

    render();

    expect(
      await screen.findByText('This scene has not been mixed yet.'),
    ).toBeInTheDocument();
  });

  it('shows the mix as its record, and says a stem cannot be read', async () => {
    serves([buildSceneMix()]);

    render();

    expect(
      await screen.findByText(
        'Four, one each for dialogue, music, effects and ambience',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/no route returns one/)).toBeInTheDocument();
  });

  it('answers a submission with the render job it became, never a file', async () => {
    const user = userEvent.setup();
    serves([]);
    server.use(
      http.post(API_PATH.sceneMixes(scene.id), () =>
        HttpResponse.json(
          { renderJobId: '55555555-5555-4555-8555-555555555555' },
          { status: 202 },
        ),
      ),
    );

    render();

    await user.click(
      await screen.findByRole('button', { name: 'Mix scene 1' }),
    );

    const announcement = await screen.findByText(
      /Submitted as render job 55555555-5555-4555-8555-555555555555/,
    );

    expect(announcement.tagName).toBe('OUTPUT');
    expect(announcement).toHaveFocus();
    expect(screen.getByText(/A mix takes minutes/)).toBeInTheDocument();
  });

  it('shows the refusal when the scene has no timeline to mix', async () => {
    const user = userEvent.setup();
    serves([]);
    server.use(
      http.post(API_PATH.sceneMixes(scene.id), () =>
        HttpResponse.json(
          {
            statusCode: 409,
            code: 'AUDIO_TIMELINE_CONFLICT',
            message: 'no shots with any length',
          },
          { status: 409 },
        ),
      ),
    );

    render();

    await user.click(
      await screen.findByRole('button', { name: 'Mix scene 1' }),
    );

    expect(
      await screen.findByText('The scene was not mixed'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/does not add up, so there is nothing coherent to mix/),
    ).toBeInTheDocument();
  });
});
