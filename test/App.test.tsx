import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import { App } from '@/App';
import { API_PATH } from '@/lib/api/api.constants';
import { renderInStore } from './render-in-store';
import { buildSystemMode } from './fixtures/system-mode.fixture';
import { buildProject } from './fixtures/project.fixture';
import { mockOrchestratorServer } from './lib/api/msw-server';

mockOrchestratorServer(
  http.get(API_PATH.systemMode(), () => HttpResponse.json(buildSystemMode())),
  http.get(API_PATH.projects(), () =>
    HttpResponse.json({ items: [buildProject({ title: 'A Quiet Harbour' })] }),
  ),
);

describe('App', () => {
  it('renders the project list at the root path', async () => {
    renderInStore(<App />);

    expect(
      screen.getByRole('heading', { name: 'Projects', level: 1 }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('heading', { name: 'A Quiet Harbour' }),
    ).toBeInTheDocument();
  });
});
