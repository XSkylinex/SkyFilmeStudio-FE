import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type {
  PreflightCheck,
  PreflightCheckId,
  PreflightReport,
  PreflightStatus,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { SystemReadiness } from '@/shell/system-readiness';
import { renderInApp } from '../../render-in-app';
import { buildPreflightReport } from '../../fixtures/preflight-report.fixture';
import { mockOrchestratorServer } from '../../lib/api/msw-server';

const server = mockOrchestratorServer();

const check = (
  id: PreflightCheckId,
  status: PreflightStatus,
): PreflightCheck => ({
  id,
  status,
  detail: 'A sentence the orchestrator wrote.',
});

const orchestratorReports = (report: PreflightReport): void => {
  server.use(http.get(API_PATH.preflight(), () => HttpResponse.json(report)));
};

describe('SystemReadiness', () => {
  it('says the machine is ready only after the orchestrator has answered', async () => {
    orchestratorReports(
      buildPreflightReport({
        passed: true,
        checks: [check('DATABASE_HEALTHY', 'PASS')],
      }),
    );

    renderInApp(<SystemReadiness />);

    expect(screen.getByText('Not yet verified')).toBeInTheDocument();
    expect(await screen.findByText('Ready to render')).toBeInTheDocument();
  });

  it('counts the failing checks rather than saying only that something is wrong', async () => {
    orchestratorReports(
      buildPreflightReport({
        passed: false,
        checks: [
          check('DATABASE_HEALTHY', 'PASS'),
          check('MODEL_FILES_PRESENT', 'FAIL'),
          check('MODEL_SMOKE_TEST', 'NOT_IMPLEMENTED'),
        ],
      }),
    );

    renderInApp(<SystemReadiness />);

    expect(
      await screen.findByText('2 of 3 checks did not pass'),
    ).toBeInTheDocument();
  });

  it('says a render will refuse to start, and by how much, when the disk gate fails', async () => {
    orchestratorReports(
      buildPreflightReport({
        passed: false,
        checks: [check('DISK_SPACE', 'FAIL')],
        diskGate: {
          freeBytes: 8_000_000_000,
          missingModelBytes: 40_000_000_000,
          workingSpaceBytes: 10_000_000_000,
          safetyHeadroomBytes: 5_000_000_000,
          requiredBytes: 55_000_000_000,
          shortfallBytes: 47_000_000_000,
          passed: false,
        },
      }),
    );

    renderInApp(<SystemReadiness />);

    expect(
      await screen.findByText(/This disk is short by:/i),
    ).toBeInTheDocument();
    const shortfall = screen.getByText('47.0 GB');
    expect(shortfall).toHaveAttribute('dir', 'ltr');
  });

  it('does not mention the disk at all while the gate passes', async () => {
    orchestratorReports(
      buildPreflightReport({
        passed: true,
        checks: [check('DISK_SPACE', 'PASS')],
      }),
    );

    renderInApp(<SystemReadiness />);

    expect(await screen.findByText('Ready to render')).toBeInTheDocument();
    expect(screen.queryByText(/short by/i)).not.toBeInTheDocument();
  });

  it('re-runs the checks on demand and shows the new answer', async () => {
    const user = userEvent.setup();
    orchestratorReports(
      buildPreflightReport({
        passed: false,
        checks: [check('MODEL_FILES_PRESENT', 'FAIL')],
      }),
    );

    renderInApp(<SystemReadiness />);
    expect(
      await screen.findByText('1 of 1 checks did not pass'),
    ).toBeInTheDocument();

    orchestratorReports(
      buildPreflightReport({
        passed: true,
        checks: [check('MODEL_FILES_PRESENT', 'PASS')],
      }),
    );
    await user.click(screen.getByRole('button', { name: 'Re-run checks' }));

    expect(await screen.findByText('Ready to render')).toBeInTheDocument();
  });

  it('reports when preflight itself could not be read, without claiming the machine is either ready or blocked', async () => {
    server.use(
      http.get(
        API_PATH.preflight(),
        () => new HttpResponse(null, { status: 503 }),
      ),
    );

    renderInApp(<SystemReadiness />);

    expect(
      await screen.findByText('Preflight could not be read'),
    ).toBeInTheDocument();
    expect(screen.queryByText('Ready to render')).not.toBeInTheDocument();
    expect(screen.queryByText(/did not pass/)).not.toBeInTheDocument();
  });

  it('stamps the answer with the time the orchestrator checked, not the time the page rendered', async () => {
    orchestratorReports(
      buildPreflightReport({
        passed: true,
        checkedAt: '2026-08-21T09:41:07.000Z',
        checks: [check('DATABASE_HEALTHY', 'PASS')],
      }),
    );

    renderInApp(<SystemReadiness />);

    expect(await screen.findByText(/^Checked .*2026/)).toBeInTheDocument();
  });
  it('announces the verdict politely once it settles, so it is not a silent visual swap', async () => {
    orchestratorReports(
      buildPreflightReport({
        passed: false,
        checks: [
          check('DATABASE_HEALTHY', 'PASS'),
          check('MEDIA_TOOLS_PRESENT', 'FAIL'),
        ],
      }),
    );

    renderInApp(<SystemReadiness />);

    const live = await screen.findByRole('status');
    expect(live).toHaveTextContent('Not yet verified');

    await screen.findByText('1 of 2 checks did not pass');

    expect(screen.getByRole('status')).toHaveTextContent(
      '1 of 2 checks did not pass',
    );
  });

  it('announces a preflight failure assertively, because it is not an ordinary update', async () => {
    server.use(http.get(API_PATH.preflight(), () => HttpResponse.error()));

    renderInApp(<SystemReadiness />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Preflight could not be read',
    );
  });
});
