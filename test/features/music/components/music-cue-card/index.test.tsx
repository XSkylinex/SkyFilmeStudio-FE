import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  musicCueIdSchema,
  projectIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { MusicCueCard } from '@/features/music/components/music-cue-card';
import { buildMusicCue } from '../../../../fixtures/music-cue.fixture';
import { renderInApp } from '../../../../render-in-app';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);
const CUE_ID = musicCueIdSchema.parse('88888888-8888-4888-8888-888888888888');

const server = mockOrchestratorServer(
  http.get('/projects/:projectId/music-cues/renders', () =>
    HttpResponse.json({ items: [] }),
  ),
  http.get(API_PATH.musicCues(PROJECT_ID), () =>
    HttpResponse.json({ items: [] }),
  ),
  http.get(API_PATH.openingEndingAssets(PROJECT_ID), () =>
    HttpResponse.json({ items: [] }),
  ),
);

const renderCard = (
  cue: ReturnType<typeof buildMusicCue> = buildMusicCue(),
): void => {
  renderInApp(
    <ul>
      <MusicCueCard projectId={PROJECT_ID} cue={cue}   onRemoved={() => undefined}
      />
    </ul>,
  );
};

describe('MusicCueCard', () => {
  it('offers approval on a draft, named for the cue it would approve', () => {
    renderCard();

    expect(
      screen.getByRole('button', { name: 'Approve the cue Opening theme' }),
    ).toBeInTheDocument();
  });

  it('renders no approval and no removal on an approved cue, so a reload cannot re-offer either', () => {
    renderCard(buildMusicCue({ approved: true }));

    expect(screen.queryByRole('button', { name: /^Approve/ })).toBeNull();
    expect(screen.queryByRole('button', { name: /^Remove/ })).toBeNull();
    expect(
      screen.getByText(/productions may already be scored with it/),
    ).toBeInTheDocument();
  });

  it('does not treat the cue as approved before the server answers', async () => {
    const user = userEvent.setup();
    let release: () => void = () => undefined;
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });
    server.use(
      http.post(API_PATH.approveMusicCue(PROJECT_ID, CUE_ID), async () => {
        await held;
        return HttpResponse.json(buildMusicCue({ approved: true }));
      }),
    );

    renderCard();

    await user.click(
      screen.getByRole('button', { name: 'Approve the cue Opening theme' }),
    );

    expect(screen.getByText('Draft')).toBeInTheDocument();
    expect(
      screen.queryByText(/productions may already be scored with it/),
    ).toBeNull();

    release();
  });

  it('says a tempo was not reported rather than showing a zero', () => {
    renderCard(buildMusicCue({ bpm: undefined }));

    expect(
      screen.getAllByText(/Not reported, which a local model often cannot do/)
        .length,
    ).toBeGreaterThan(0);
  });

  it('says a licence is absent rather than leaving the row blank', () => {
    renderCard(buildMusicCue({ licence: undefined }));

    expect(
      screen.getByText(/allows for a cue this installation generated/),
    ).toBeInTheDocument();
  });

  it('removes a draft cue, named for the cue it would remove', async () => {
    const user = userEvent.setup();
    let deleted = false;
    server.use(
      http.delete(API_PATH.musicCue(PROJECT_ID, CUE_ID), () => {
        deleted = true;
        return HttpResponse.json(buildMusicCue());
      }),
    );

    renderCard();

    await user.click(
      screen.getByRole('button', { name: 'Remove the cue Opening theme' }),
    );

    await waitFor(() => {
      expect(deleted).toBe(true);
    });
  });
});
