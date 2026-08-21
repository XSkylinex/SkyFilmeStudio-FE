import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import { App } from '@/App';
import { API_PATH } from '@/lib/api/api.constants';
import { renderInStore } from './render-in-store';
import { buildSystemMode } from './fixtures/system-mode.fixture';
import { mockOrchestratorServer } from './lib/api/msw-server';

mockOrchestratorServer(
  http.get(API_PATH.systemMode(), () => HttpResponse.json(buildSystemMode())),
);

describe('App', () => {
  it('renders the project list at the root path', () => {
    renderInStore(<App />);

    expect(
      screen.getByRole('heading', { name: 'Projects' }),
    ).toBeInTheDocument();
  });
});
