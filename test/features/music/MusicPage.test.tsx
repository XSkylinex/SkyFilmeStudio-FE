import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { projectIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { MusicPage } from '@/features/music/MusicPage';
import { PROJECT_ID_PARAM } from '@/shell/routes/routes.constants';
import { buildMusicCue } from '../../fixtures/music-cue.fixture';
import { renderInApp } from '../../render-in-app';
import { mockOrchestratorServer } from '../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const serves = (
  items: readonly ReturnType<typeof buildMusicCue>[],
  nextCursor?: string,
): void => {
  server.use(
    http.get(API_PATH.musicCues(PROJECT_ID), () =>
      HttpResponse.json(
        nextCursor === undefined ? { items } : { items, nextCursor },
      ),
    ),
  );
};

const renderAt = (projectId: string = PROJECT_ID): void => {
  renderInApp(
    <MemoryRouter initialEntries={[`/projects/${projectId}/music`]}>
      <Routes>
        <Route
          path={`/projects/:${PROJECT_ID_PARAM}/music`}
          element={<MusicPage />}
        />
      </Routes>
    </MemoryRouter>,
  );
};

describe('MusicPage', () => {
  it('refuses a project id the contract does not accept', () => {
    renderAt('not-a-project-id');

    expect(
      screen.getByRole('heading', { level: 1, name: /project/i }),
    ).toBeInTheDocument();
  });

  it('shows a cue with the level that makes the ducking envelope computable', async () => {
    serves([buildMusicCue()]);

    renderAt();

    expect(
      await screen.findByRole('heading', { level: 3, name: 'Opening theme' }),
    ).toBeInTheDocument();
    expect(screen.getByText('MAIN_THEME')).toBeInTheDocument();
    expect(screen.getByText('-18 dB')).toBeInTheDocument();
    expect(
      screen.getByText(/computable rather than drawn by hand/),
    ).toBeInTheDocument();
  });

  it('says the render list cannot be read here, and why, rather than offering a promotion it cannot make', async () => {
    serves([]);

    renderAt();

    expect(await screen.findByText('No cues yet')).toBeInTheDocument();
    expect(
      screen.getByText(/a type the orchestrator keeps in a repository file/),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /promote/i })).toBeNull();
  });

  it('says no cue can be heard here, because nothing serves an artifact’s bytes', async () => {
    serves([buildMusicCue()]);

    renderAt();

    expect(
      await screen.findByText(/No cue can be heard here/),
    ).toBeInTheDocument();
  });

  it('says the list is truncated when the orchestrator offers another page', async () => {
    serves([buildMusicCue()], 'more');

    renderAt();

    expect(
      await screen.findByText(/first page of cues only/),
    ).toBeInTheDocument();
  });
});
