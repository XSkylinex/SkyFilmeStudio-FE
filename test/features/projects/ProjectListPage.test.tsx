import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  languageTagSchema,
  projectIdSchema,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { ProjectListPage } from '@/features/projects/ProjectListPage';
import { renderInApp } from '../../render-in-app';
import { buildProject } from '../../fixtures/project.fixture';
import { mockOrchestratorServer } from '../../lib/api/msw-server';

const server = mockOrchestratorServer();

const orchestratorLists = (items: unknown[]): void => {
  server.use(http.get(API_PATH.projects(), () => HttpResponse.json({ items })));
};

describe('ProjectListPage', () => {
  it('names each project the orchestrator returned', async () => {
    orchestratorLists([
      buildProject({ title: 'A Quiet Harbour' }),
      buildProject({
        id: projectIdSchema.parse('d3f2e6a4-9f4a-4a2b-8f4c-0f8b6d9a1e22'),
        title: 'Night Shift',
      }),
    ]);

    renderInApp(
      <MemoryRouter>
        <ProjectListPage />
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole('heading', { name: 'A Quiet Harbour', level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Night Shift', level: 2 }),
    ).toBeInTheDocument();
  });

  it('links each project to its own dashboard', async () => {
    const project = buildProject({ title: 'A Quiet Harbour' });
    orchestratorLists([project]);

    renderInApp(
      <MemoryRouter>
        <ProjectListPage />
      </MemoryRouter>,
    );

    const link = await screen.findByRole('link', {
      name: 'Open A Quiet Harbour',
    });
    expect(link).toHaveAttribute('href', `/projects/${project.id}`);
  });

  it('says there are none rather than rendering an empty grid', async () => {
    orchestratorLists([]);

    renderInApp(
      <MemoryRouter>
        <ProjectListPage />
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole('heading', { name: 'No projects yet', level: 1 }),
    ).toBeInTheDocument();
  });

  it('never offers a create control, because nothing here can create one yet', async () => {
    orchestratorLists([]);

    renderInApp(
      <MemoryRouter>
        <ProjectListPage />
      </MemoryRouter>,
    );

    await screen.findByRole('heading', { name: 'No projects yet', level: 1 });

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('says the list could not be read when the orchestrator does not answer', async () => {
    server.use(http.get(API_PATH.projects(), () => HttpResponse.error()));

    renderInApp(
      <MemoryRouter>
        <ProjectListPage />
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole('heading', {
        name: 'The project list could not be read',
        level: 1,
      }),
    ).toBeInTheDocument();
  });

  it('renders a Hebrew title right-to-left inside an English interface', async () => {
    orchestratorLists([
      buildProject({
        title: 'נמל שקט',
        primaryLanguage: languageTagSchema.parse('he'),
      }),
    ]);

    renderInApp(
      <MemoryRouter>
        <ProjectListPage />
      </MemoryRouter>,
    );

    const title = await screen.findByText('נמל שקט');

    expect(title.tagName).toBe('BDI');
    expect(title).toHaveAttribute('dir', 'rtl');
    expect(document.documentElement.dir).not.toBe('rtl');
  });
});
