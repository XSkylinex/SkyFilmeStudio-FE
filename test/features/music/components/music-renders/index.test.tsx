import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { projectIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { MusicRenders } from '@/features/music/components/music-renders';
import { buildMusicCue } from '../../../../fixtures/music-cue.fixture';
import { buildMusicCueRender } from '../../../../fixtures/music-cue-render.fixture';
import { renderInApp } from '../../../../render-in-app';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const server = mockOrchestratorServer();

const serves = (
  items: readonly ReturnType<typeof buildMusicCueRender>[],
  nextCursor?: string,
): void => {
  server.use(
    http.get(API_PATH.musicCueRenders(PROJECT_ID), () =>
      HttpResponse.json(
        nextCursor === undefined ? { items } : { items, nextCursor },
      ),
    ),
  );
};

const render = (): void => {
  renderInApp(<MusicRenders projectId={PROJECT_ID} />);
};

const fillSubmit = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText('Category'), 'MAIN_THEME');
  await user.type(screen.getByLabelText('Mood'), 'Hopeful');
  await user.type(screen.getByLabelText('Prompt'), 'A warm string figure');
  await user.type(screen.getByLabelText('Duration in seconds'), '90');
};

describe('MusicRenders', () => {
  it('says no candidate has been rendered rather than showing an empty list', async () => {
    serves([]);

    render();

    expect(
      await screen.findByText(/No candidate has been rendered yet/),
    ).toBeInTheDocument();
  });

  it('says promotion is a decision a person makes, not the model', async () => {
    serves([]);

    render();

    expect(
      await screen.findByText(/promotion is a decision a person makes/),
    ).toBeInTheDocument();
  });

  it('submits a candidate and answers with the render job, never a file', async () => {
    const user = userEvent.setup();
    serves([]);
    let posted: unknown;
    server.use(
      http.post(API_PATH.musicCueRenders(PROJECT_ID), async ({ request }) => {
        posted = await request.json();
        return HttpResponse.json(
          { renderJobId: '55555555-5555-4555-8555-555555555555' },
          { status: 202 },
        );
      }),
    );

    render();

    await fillSubmit(user);
    await user.click(
      screen.getByRole('button', { name: 'Render a candidate' }),
    );

    await waitFor(() => {
      expect(posted).toBeDefined();
    });
    expect(posted).toStrictEqual({
      category: 'MAIN_THEME',
      mood: 'Hopeful',
      prompt: 'A warm string figure',
      durationSeconds: 90,
    });
    const announcement = await screen.findByText(
      /Submitted as render job 55555555-5555-4555-8555-555555555555/,
    );
    expect(announcement.tagName).toBe('OUTPUT');
  });

  it('sends a seed when one is given, so a render can be repeated', async () => {
    const user = userEvent.setup();
    serves([]);
    let posted: unknown;
    server.use(
      http.post(API_PATH.musicCueRenders(PROJECT_ID), async ({ request }) => {
        posted = await request.json();
        return HttpResponse.json({
          renderJobId: '55555555-5555-4555-8555-555555555555',
        });
      }),
    );

    render();

    await fillSubmit(user);
    await user.type(screen.getByLabelText('Seed'), '4242');
    await user.click(
      screen.getByRole('button', { name: 'Render a candidate' }),
    );

    await waitFor(() => {
      expect(posted).toBeDefined();
    });
    expect(posted).toMatchObject({ seed: 4_242 });
  });

  it('shows a candidate as its record, because nothing can be heard', async () => {
    serves([buildMusicCueRender()]);

    render();

    expect(
      await screen.findByText('A warm string figure that does not resolve'),
    ).toBeInTheDocument();
    expect(screen.getByText('musicgen-local')).toBeInTheDocument();
    expect(screen.getByText('4242')).toBeInTheDocument();
    expect(screen.getByText('-1.4 dB')).toBeInTheDocument();
  });

  it('says a seed was not recorded rather than showing a blank', async () => {
    serves([buildMusicCueRender({ seed: undefined })]);

    render();

    expect(await screen.findByText('Not recorded')).toBeInTheDocument();
  });

  it('promotes a candidate with the facts the library needs and the render does not carry', async () => {
    const user = userEvent.setup();
    const candidate = buildMusicCueRender();
    serves([candidate]);
    let posted: unknown;
    server.use(
      http.post(API_PATH.musicCues(PROJECT_ID), async ({ request }) => {
        posted = await request.json();
        return HttpResponse.json(buildMusicCue());
      }),
    );

    render();

    await user.click(
      await screen.findByRole('button', { name: 'Promote into the library' }),
    );
    await user.type(screen.getByLabelText('Name'), 'Opening theme');
    await user.type(screen.getByLabelText('Intro in milliseconds'), '4000');
    await user.type(screen.getByLabelText('Outro in milliseconds'), '6000');
    await user.type(screen.getByLabelText(/Safe dialogue level/), '-18');
    await user.click(screen.getByRole('button', { name: 'Promote' }));

    await waitFor(() => {
      expect(posted).toBeDefined();
    });
    expect(posted).toStrictEqual({
      renderId: candidate.id,
      name: 'Opening theme',
      loopable: false,
      introMs: 4_000,
      outroMs: 6_000,
      safeDialogueLevelDb: -18,
    });
  });

  it('names the render it is promoting, so a second candidate cannot be promoted by mistake', async () => {
    const user = userEvent.setup();
    const candidate = buildMusicCueRender();
    serves([candidate]);
    let posted: unknown;
    server.use(
      http.post(API_PATH.musicCues(PROJECT_ID), async ({ request }) => {
        posted = await request.json();
        return HttpResponse.json(buildMusicCue());
      }),
    );

    render();

    await user.click(
      await screen.findByRole('button', { name: 'Promote into the library' }),
    );
    await user.type(screen.getByLabelText('Name'), 'Opening theme');
    await user.type(screen.getByLabelText('Intro in milliseconds'), '0');
    await user.type(screen.getByLabelText('Outro in milliseconds'), '0');
    await user.type(screen.getByLabelText(/Safe dialogue level/), '-18');
    await user.click(screen.getByRole('button', { name: 'Promote' }));

    await waitFor(() => {
      expect(posted).toBeDefined();
    });
    expect((posted as { renderId: string }).renderId).toBe(candidate.id);
  });

  it('says a candidate cannot be heard, and why', async () => {
    serves([buildMusicCueRender()]);

    render();

    expect(await screen.findByText('musicgen-local')).toBeInTheDocument();
  });
});
