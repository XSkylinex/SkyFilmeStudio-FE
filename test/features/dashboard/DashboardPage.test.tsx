import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import { createRoutesStub } from 'react-router-dom';
import type {
  PreflightCheck,
  PreflightReport,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { systemPath } from '@/shell/routes/routes.constants';
import { renderInApp } from '../../render-in-app';
import { buildPreflightReport } from '../../fixtures/preflight-report.fixture';
import { mockOrchestratorServer } from '../../lib/api/msw-server';

const server = mockOrchestratorServer();

const failingCheck: PreflightCheck = {
  id: 'MODEL_FILES_PRESENT',
  status: 'FAIL',
  detail: 'Two model files are not on disk.',
  errorCode: 'MODEL_FILE_MISSING',
};

const orchestratorReports = (report: PreflightReport): void => {
  server.use(http.get(API_PATH.preflight(), () => HttpResponse.json(report)));
};

const renderDashboard = (): void => {
  const Stub = createRoutesStub([{ path: '/', Component: DashboardPage }]);
  renderInApp(<Stub initialEntries={['/']} />);
};

describe('DashboardPage', () => {
  it('keeps its own page heading', () => {
    orchestratorReports(buildPreflightReport({}));
    renderDashboard();

    expect(
      screen.getByRole('heading', { name: 'Dashboard', level: 1 }),
    ).toBeInTheDocument();
  });

  it('answers whether this machine can proceed above anything about the project', async () => {
    orchestratorReports(
      buildPreflightReport({ passed: false, checks: [failingCheck] }),
    );

    renderDashboard();

    expect(
      await screen.findByText('1 of 1 checks did not pass'),
    ).toBeInTheDocument();
  });

  it('offers the detail screen rather than repeating it', () => {
    orchestratorReports(buildPreflightReport({}));
    renderDashboard();

    expect(
      screen.getByRole('link', { name: 'Open system status' }),
    ).toHaveAttribute('href', systemPath());
  });

  it('says plainly that no project data is served yet, instead of showing counts of zero', async () => {
    orchestratorReports(buildPreflightReport({}));
    renderDashboard();

    expect(
      await screen.findByText('Nothing in this project is wired up yet'),
    ).toBeInTheDocument();
    expect(screen.getByText(/serves no project data yet/)).toBeInTheDocument();
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('no longer claims the page is not connected to the orchestrator, because it is', () => {
    orchestratorReports(buildPreflightReport({}));
    renderDashboard();

    expect(
      screen.queryByText(/Not connected to the orchestrator yet/i),
    ).not.toBeInTheDocument();
  });
});
