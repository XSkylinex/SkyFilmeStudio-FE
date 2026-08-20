import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import { API_PATH } from '@/lib/api/api.constants';
import { SystemPage } from '@/features/system/SystemPage';
import { renderInApp } from '../../render-in-app';
import { buildModelSetupReport } from '../../fixtures/model-setup-report.fixture';
import { buildPreflightReport } from '../../fixtures/preflight-report.fixture';
import { buildSystemMode } from '../../fixtures/system-mode.fixture';
import { mockOrchestratorServer } from '../../lib/api/msw-server';

mockOrchestratorServer(
  http.get(API_PATH.preflight(), () =>
    HttpResponse.json(buildPreflightReport({})),
  ),
  http.get(API_PATH.modelSetup(), () =>
    HttpResponse.json(buildModelSetupReport()),
  ),
  http.get(API_PATH.systemMode(), () => HttpResponse.json(buildSystemMode())),
);

describe('SystemPage', () => {
  it('keeps its own page heading', () => {
    renderInApp(<SystemPage />);

    expect(
      screen.getByRole('heading', { name: 'System', level: 1 }),
    ).toBeInTheDocument();
  });

  it('shows every panel the phase asks for, including the ones with no data source', async () => {
    renderInApp(<SystemPage />);
    await screen.findByText('Ready to render');

    [
      'Hardware profile',
      'Disk',
      'Operating mode',
      'Preflight',
      'Models',
    ].forEach((title) => {
      expect(
        screen.getByRole('heading', { name: title, level: 2 }),
      ).toBeInTheDocument();
    });
  });

  it('names memory and runtimes rather than hiding the panels the orchestrator cannot fill', async () => {
    renderInApp(<SystemPage />);
    await screen.findByText('Ready to render');

    expect(
      screen.getByRole('heading', { name: 'Memory and pressure', level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/absent measurement, not a measurement of zero/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Runtimes', level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/publishes no version for ComfyUI/),
    ).toBeInTheDocument();
  });

  it('offers nothing anywhere on the page that would download a model', async () => {
    renderInApp(<SystemPage />);
    await screen.findByText('Ready to render');

    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(
      screen.getByRole('button', { name: 'Re-run checks' }),
    ).toBeInTheDocument();
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });

  it('no longer claims the page is not connected to the orchestrator, because it is', () => {
    renderInApp(<SystemPage />);

    expect(
      screen.queryByText(/Not connected to the orchestrator yet/i),
    ).not.toBeInTheDocument();
  });
});
