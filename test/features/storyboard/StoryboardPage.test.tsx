import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { productionIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { StoryboardPage } from '@/features/storyboard/StoryboardPage';
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

const server = mockOrchestratorServer();

const renderAt = (productionId: string): void => {
  renderInApp(
    <MemoryRouter initialEntries={[`/projects/proj-1/p/${productionId}`]}>
      <Routes>
        <Route
          path={`/projects/:${PROJECT_ID_PARAM}/p/:${PRODUCTION_ID_PARAM}`}
          element={<StoryboardPage />}
        />
      </Routes>
    </MemoryRouter>,
  );
};

describe('StoryboardPage', () => {
  it('refuses a production id the contract does not accept', () => {
    renderAt('not-a-production-id');

    expect(
      screen.getByRole('heading', {
        name: 'That is not a project id',
        level: 1,
      }),
    ).toBeInTheDocument();
  });

  it('renders the review once the orchestrator answers with scenes', async () => {
    server.use(
      http.get(API_PATH.planningScenes(PRODUCTION_ID), () =>
        HttpResponse.json([
          buildScene({ order: 1, purpose: 'Open on the bay' }),
        ]),
      ),
    );

    renderAt(PRODUCTION_ID);

    expect(
      await screen.findByRole('heading', {
        name: 'Storyboard review',
        level: 1,
      }),
    ).toBeInTheDocument();
    expect(await screen.findByText('Open on the bay')).toBeInTheDocument();
  });

  it('says a production with no scenes is waiting on plan approval', async () => {
    server.use(
      http.get(API_PATH.planningScenes(PRODUCTION_ID), () =>
        HttpResponse.json([]),
      ),
    );

    renderAt(PRODUCTION_ID);

    expect(
      await screen.findByRole('heading', {
        name: 'No scenes are planned yet',
        level: 2,
      }),
    ).toBeInTheDocument();
  });
});
