import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { projectIdSchema } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { SubjectsPage } from '@/features/subjects/SubjectsPage';
import { renderInApp } from '../../render-in-app';
import { buildSubject } from '../../fixtures/subject.fixture';
import { mockOrchestratorServer } from '../../lib/api/msw-server';

const server = mockOrchestratorServer();

const PROJECT_ID = projectIdSchema.parse(
  'c2f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e11',
);

const renderAt = (path: string): void => {
  renderInApp(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/projects/:projectId/subjects"
          element={<SubjectsPage />}
        />
      </Routes>
    </MemoryRouter>,
  );
};

const orchestratorServes = (...items: ReturnType<typeof buildSubject>[]) => {
  server.use(
    http.get(API_PATH.projectSubjects(PROJECT_ID), () =>
      HttpResponse.json({ items }),
    ),
  );
};

describe('SubjectsPage', () => {
  it('lists the project subjects under its own heading', async () => {
    orchestratorServes(buildSubject({ displayName: 'Mira' }));

    renderAt(`/projects/${PROJECT_ID}/subjects`);

    expect(
      screen.getByRole('heading', { name: 'Subjects', level: 1 }),
    ).toBeInTheDocument();
    expect(await screen.findByText('Mira')).toBeInTheDocument();
  });

  it('says registration is unwired rather than implying the project is empty', async () => {
    orchestratorServes();

    renderAt(`/projects/${PROJECT_ID}/subjects`);

    expect(
      await screen.findByRole('heading', { name: 'No subjects yet' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/request shape is not published/i),
    ).toBeInTheDocument();
  });

  it('marks an inactive subject apart from an active one', async () => {
    orchestratorServes(buildSubject({ active: false }));

    renderAt(`/projects/${PROJECT_ID}/subjects`);

    expect(await screen.findByText('Inactive')).toBeInTheDocument();
  });

  it('refuses a project id the orchestrator would reject, without asking it', () => {
    renderAt('/projects/not-a-uuid/subjects');

    expect(
      screen.getByRole('heading', { name: 'That is not a project id' }),
    ).toBeInTheDocument();
  });
});
