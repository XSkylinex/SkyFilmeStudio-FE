import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import {
  productionIdSchema,
  projectIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { PlannerPage } from '@/features/planner/PlannerPage';
import { renderInApp } from '../../render-in-app';
import { buildProduction } from '../../fixtures/production.fixture';
import { buildRuntimeBudgetReport } from '../../fixtures/runtime-budget.fixture';
import { mockOrchestratorServer } from '../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);
const PRODUCTION_ID = productionIdSchema.parse(
  '33333333-3333-4333-8333-333333333333',
);
const ROUTE = '/projects/:projectId/productions/:productionId/plan';

const renderAt = (path: string): void => {
  renderInApp(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={ROUTE} element={<PlannerPage />} />
      </Routes>
    </MemoryRouter>,
  );
};

const orchestratorServesAMusicVideo = (): void => {
  server.use(
    http.get(API_PATH.production(PROJECT_ID, PRODUCTION_ID), () =>
      HttpResponse.json(
        buildProduction({
          id: PRODUCTION_ID,
          projectId: PROJECT_ID,
          title: 'כל העולם כולו',
          productionKind: 'MUSIC_VIDEO',
          narrativeMode: 'MUSIC_DRIVEN',
          targetRuntimeSeconds: 210,
        }),
      ),
    ),
    http.get(API_PATH.planningStages(PRODUCTION_ID), () =>
      HttpResponse.json([
        'MUSIC_SECTIONS',
        'VISUAL_BEATS',
        'SCENE_OUTLINE',
        'RUNTIME_ESTIMATE',
      ]),
    ),
    http.get(API_PATH.planningBudget(PRODUCTION_ID), () =>
      HttpResponse.json(
        buildRuntimeBudgetReport({
          targetRuntimeSeconds: 210,
          segments: [{ label: 'פתיחה', targetDurationSeconds: 210 }],
        }),
      ),
    ),
  );
};

describe('PlannerPage', () => {
  it('offers no screenplay stage on a music-driven production', async () => {
    orchestratorServesAMusicVideo();

    renderAt(`/projects/${PROJECT_ID}/productions/${PRODUCTION_ID}/plan`);

    expect(await screen.findByText('Music sections')).toBeInTheDocument();
    expect(
      screen.queryByText('Screenplay and dialogue'),
    ).not.toBeInTheDocument();
  });

  it('renders a production title in its own direction inside an English shell', async () => {
    orchestratorServesAMusicVideo();

    renderAt(`/projects/${PROJECT_ID}/productions/${PRODUCTION_ID}/plan`);

    const heading = await screen.findByRole('heading', { level: 1 });
    const isolated = heading.querySelector('bdi');

    expect(isolated).toHaveAttribute('dir', 'auto');
    expect(isolated).toHaveTextContent('כל העולם כולו');
  });

  it('shows a three-and-a-half-minute target as a clock, assuming nothing about twenty minutes', async () => {
    orchestratorServesAMusicVideo();

    renderAt(`/projects/${PROJECT_ID}/productions/${PRODUCTION_ID}/plan`);

    expect(await screen.findByText('Target runtime:')).toBeInTheDocument();
    expect(screen.getAllByText('3:30').length).toBeGreaterThan(0);
  });

  it('refuses a route parameter that is not an id, without asking the orchestrator', () => {
    renderAt('/projects/not-a-uuid/productions/also-not-a-uuid/plan');

    expect(
      screen.getByRole('heading', {
        name: 'That is not a project id',
        level: 1,
      }),
    ).toBeInTheDocument();
  });

  it('offers no approval heading at all when the budget cannot be judged', async () => {
    server.use(
      http.get(API_PATH.production(PROJECT_ID, PRODUCTION_ID), () =>
        HttpResponse.json(
          buildProduction({ id: PRODUCTION_ID, projectId: PROJECT_ID }),
        ),
      ),
      http.get(API_PATH.planningStages(PRODUCTION_ID), () =>
        HttpResponse.json(['RUNTIME_ESTIMATE']),
      ),
      http.get(API_PATH.planningBudget(PRODUCTION_ID), () =>
        HttpResponse.json(
          {
            statusCode: 409,
            code: 'RUNTIME_TOLERANCE_UNDECLARED',
            message: 'Production x declares no runtime tolerance.',
          },
          { status: 409 },
        ),
      ),
    );

    renderAt(`/projects/${PROJECT_ID}/productions/${PRODUCTION_ID}/plan`);

    expect(
      await screen.findByRole('heading', {
        name: 'Nothing here declares a tolerance',
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Approve the plan' }),
    ).not.toBeInTheDocument();
  });
});
