import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { projectIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { AssetsPage } from '@/features/assets/AssetsPage';
import { renderInApp } from '../../render-in-app';
import { mockOrchestratorServer } from '../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const renderAt = (path: string): void => {
  renderInApp(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/projects/:projectId/assets" element={<AssetsPage />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('AssetsPage', () => {
  it('lists the project assets under its own heading', async () => {
    server.use(
      http.get(API_PATH.projectAssets(PROJECT_ID), () =>
        HttpResponse.json({ items: [] }),
      ),
    );

    renderAt(`/projects/${PROJECT_ID}/assets`);

    expect(
      screen.getByRole('heading', { name: 'Source assets', level: 1 }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('heading', { name: 'No source assets yet' }),
    ).toBeInTheDocument();
  });

  it('refuses a project id the orchestrator would reject, without asking it', async () => {
    renderAt('/projects/not-a-uuid/assets');

    expect(
      screen.getByRole('heading', { name: 'That is not a project id' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Source assets' }),
    ).not.toBeInTheDocument();
  });
});
