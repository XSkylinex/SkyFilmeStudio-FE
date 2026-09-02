import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { productionIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { AudioPage } from '@/features/audio/AudioPage';
import {
  PRODUCTION_ID_PARAM,
  PROJECT_ID_PARAM,
} from '@/shell/routes/routes.constants';
import { renderInApp } from '../../render-in-app';
import { mockOrchestratorServer } from '../../lib/api/msw-server';
import { buildScene } from '../../fixtures/scene.fixture';

const PRODUCTION_ID = productionIdSchema.parse(
  '3f9a1c6e-1f0d-4a2b-8c7d-5e6f70819a2b',
);

const server = mockOrchestratorServer(
  http.get(API_PATH.productionMixes(PRODUCTION_ID), () =>
    HttpResponse.json([]),
  ),
  http.get('/scenes/:sceneId/mixes', () => HttpResponse.json([])),
);

const PROJECT_ID = '44444444-4444-4444-8444-444444444444';

const renderAt = (productionId: string): void => {
  renderInApp(
    <MemoryRouter
      initialEntries={[`/projects/${PROJECT_ID}/p/${productionId}`]}
    >
      <Routes>
        <Route
          path={`/projects/:${PROJECT_ID_PARAM}/p/:${PRODUCTION_ID_PARAM}`}
          element={<AudioPage />}
        />
      </Routes>
    </MemoryRouter>,
  );
};

describe('AudioPage', () => {
  it('refuses a production id the contract does not accept', () => {
    renderAt('not-a-production-id');

    expect(
      screen.getByRole('heading', {
        name: 'That is not a project id',
        level: 1,
      }),
    ).toBeInTheDocument();
  });

  it('renders the dialogue review once the orchestrator answers with scenes', async () => {
    server.use(
      http.get(API_PATH.planningScenes(PRODUCTION_ID), () =>
        HttpResponse.json([buildScene({ order: 1 })]),
      ),
    );

    renderAt(PRODUCTION_ID);

    expect(
      await screen.findByRole('heading', {
        name: 'Dialogue audio',
        level: 1,
      }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('heading', { name: 'Scene 1', level: 2 }),
    ).toBeInTheDocument();
  });

  it('says what it cannot do, rather than showing an empty mix', async () => {
    server.use(
      http.get(API_PATH.planningScenes(PRODUCTION_ID), () =>
        HttpResponse.json([]),
      ),
    );

    renderAt(PRODUCTION_ID);

    expect(
      await screen.findByRole('heading', {
        name: 'What this screen cannot do yet',
        level: 2,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/No audio can be played/)).toBeInTheDocument();
  });
});
