import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import {
  productionIdSchema,
  projectIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { routeTree } from '@/shell/routes/route-tree';
import {
  productionAudioPath,
  productionShotsPath,
  productionStoryboardPath,
  projectSubjectsPath,
} from '@/shell/routes/routes.constants';
import { renderInApp } from '../../render-in-app';
import { buildScene } from '../../fixtures/scene.fixture';
import { buildSystemMode } from '../../fixtures/system-mode.fixture';
import { mockOrchestratorServer } from '../../lib/api/msw-server';

const PROJECT_ID = projectIdSchema.parse(
  '44444444-4444-4444-8444-444444444444',
);

const PRODUCTION_ID = productionIdSchema.parse(
  '3f9a1c6e-1f0d-4a2b-8c7d-5e6f70819a2b',
);

mockOrchestratorServer(
  http.get(API_PATH.systemMode(), () => HttpResponse.json(buildSystemMode())),
  http.get(API_PATH.projectSubjects(PROJECT_ID), () =>
    HttpResponse.json({ items: [] }),
  ),
  http.get(API_PATH.planningScenes(PRODUCTION_ID), () =>
    HttpResponse.json([buildScene({ subjectIds: [] })]),
  ),
);

const renderAt = (path: string): void => {
  renderInApp(
    <RouterProvider
      router={createMemoryRouter(routeTree, { initialEntries: [path] })}
    />,
  );
};

describe('a production with zero subjects', () => {
  it.each([
    ['the subject list', projectSubjectsPath(PROJECT_ID)],
    ['the storyboard', productionStoryboardPath(PROJECT_ID, PRODUCTION_ID)],
    ['the shot review', productionShotsPath(PROJECT_ID, PRODUCTION_ID)],
    ['the dialogue audio', productionAudioPath(PROJECT_ID, PRODUCTION_ID)],
  ])('renders %s without reaching an error boundary', async (_name, path) => {
    renderAt(path);

    const headings = await screen.findAllByRole('heading', { level: 1 });

    expect(headings.length).toBeGreaterThan(0);
    expect(
      screen.queryByRole('heading', { name: "This page couldn't load" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /unrecoverable error/ }),
    ).not.toBeInTheDocument();
  });
});
