import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import {
  productionIdSchema,
  sceneIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { ShotsPage } from '@/features/shots/ShotsPage';
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
          element={<ShotsPage />}
        />
      </Routes>
    </MemoryRouter>,
  );
};

describe('ShotsPage', () => {
  it('refuses a production id the contract does not accept', () => {
    renderAt('not-a-production-id');

    expect(
      screen.getByRole('heading', {
        name: 'That is not a project id',
        level: 1,
      }),
    ).toBeInTheDocument();
  });

  it('renders the review queue once the orchestrator answers with scenes', async () => {
    server.use(
      http.get(API_PATH.planningScenes(PRODUCTION_ID), () =>
        HttpResponse.json([
          buildScene({
            id: sceneIdSchema.parse('99999999-9999-4999-8999-999999999999'),
            order: 2,
          }),
          buildScene({ order: 1 }),
        ]),
      ),
    );

    renderAt(PRODUCTION_ID);

    expect(
      await screen.findByRole('heading', { name: 'Shot review', level: 1 }),
    ).toBeInTheDocument();
    await screen.findByRole('heading', { name: 'Scene 1', level: 2 });
    const scenes = screen.getAllByRole('heading', { level: 2 });
    expect(scenes.map((heading) => heading.textContent)).toEqual([
      'Scene 1',
      'Scene 2',
      'What this screen cannot do yet',
    ]);
  });

  it('says what it cannot do, and that a decision is read rather than made here', async () => {
    server.use(
      http.get(API_PATH.planningScenes(PRODUCTION_ID), () =>
        HttpResponse.json([]),
      ),
    );

    renderAt(PRODUCTION_ID);

    expect(
      await screen.findByText(/A shot cannot be approved or rejected here/),
    ).toBeInTheDocument();
  });
});
