import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import type {
  PreflightCheck,
  PreflightCheckId,
  PreflightReport,
  PreflightStatus,
} from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { PreflightChecksPanel } from '@/features/system/components/preflight-checks-panel';
import { renderInApp } from '../../../../render-in-app';
import { buildPreflightReport } from '../../../../fixtures/preflight-report.fixture';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const check = (
  id: PreflightCheckId,
  status: PreflightStatus,
  extra: Partial<PreflightCheck> = {},
): PreflightCheck => ({
  id,
  status,
  detail: 'A sentence the orchestrator wrote.',
  ...extra,
});

const orchestratorReports = (report: PreflightReport): void => {
  server.use(http.get(API_PATH.preflight(), () => HttpResponse.json(report)));
};

describe('PreflightChecksPanel', () => {
  it('never styles or labels a check that did not run as passing, and says so in words', async () => {
    orchestratorReports(
      buildPreflightReport({
        passed: false,
        checks: [check('MODEL_SMOKE_TEST', 'NOT_IMPLEMENTED')],
      }),
    );

    const { container } = renderInApp(<PreflightChecksPanel />);

    expect(
      await screen.findByText(
        'A check that did not run is not a check that passed.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Not implemented')).toBeInTheDocument();
    expect(screen.queryByText('Passed')).not.toBeInTheDocument();

    const row = container.querySelector('[data-status="NOT_IMPLEMENTED"]');
    expect(row).toBeInTheDocument();
    expect(row?.querySelector('[data-tone]')).toHaveAttribute(
      'data-tone',
      'stale',
    );
  });

  it('renders the actionable taxonomy sentence for a check carrying an error code, not just the code', async () => {
    orchestratorReports(
      buildPreflightReport({
        passed: false,
        checks: [check('DISK_SPACE', 'FAIL', { errorCode: 'DISK_SPACE_LOW' })],
      }),
    );

    renderInApp(<PreflightChecksPanel />);

    expect(
      await screen.findByText(
        'There is not enough free space to start this render, so it was refused before starting. Free space, or move the project root to a larger disk, before submitting again.',
      ),
    ).toBeInTheDocument();
  });

  it('renders the raw check id and the raw error code verbatim, each isolated for left-to-right reading', async () => {
    orchestratorReports(
      buildPreflightReport({
        passed: false,
        checks: [check('DISK_SPACE', 'FAIL', { errorCode: 'DISK_SPACE_LOW' })],
      }),
    );

    renderInApp(<PreflightChecksPanel />);

    const checkId = await screen.findByText('DISK_SPACE');
    expect(checkId.tagName).toBe('CODE');
    expect(checkId).toHaveAttribute('dir', 'ltr');

    const errorCode = screen.getByText('DISK_SPACE_LOW');
    expect(errorCode.tagName).toBe('CODE');
    expect(errorCode).toHaveAttribute('dir', 'ltr');
  });

  it("passes the backend's own detail sentence through unchanged", async () => {
    orchestratorReports(
      buildPreflightReport({
        checks: [
          check('COMFYUI_HEALTHY', 'FAIL', {
            detail: 'ComfyUI answered with HTTP 503 twice in a row.',
          }),
        ],
      }),
    );

    renderInApp(<PreflightChecksPanel />);

    expect(
      await screen.findByText('ComfyUI answered with HTTP 503 twice in a row.'),
    ).toBeInTheDocument();
  });

  it('renders checks in the order the backend returned them, not sorted', async () => {
    orchestratorReports(
      buildPreflightReport({
        passed: false,
        checks: [
          check('NO_PUBLIC_ENDPOINT', 'PASS'),
          check('DATABASE_HEALTHY', 'PASS'),
          check('DISK_SPACE', 'FAIL'),
        ],
      }),
    );

    renderInApp(<PreflightChecksPanel />);

    const ids = (
      await screen.findAllByText(
        /^(NO_PUBLIC_ENDPOINT|DATABASE_HEALTHY|DISK_SPACE)$/,
      )
    ).map((node) => node.textContent);

    expect(ids).toEqual([
      'NO_PUBLIC_ENDPOINT',
      'DATABASE_HEALTHY',
      'DISK_SPACE',
    ]);
  });

  it('renders the error state and not a half-panel when preflight itself cannot be read', async () => {
    server.use(
      http.get(
        API_PATH.preflight(),
        () => new HttpResponse(null, { status: 503 }),
      ),
    );

    renderInApp(<PreflightChecksPanel />);

    expect(screen.getByText('Preflight')).toBeInTheDocument();
    expect(
      await screen.findByText('Preflight could not be read'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(screen.queryByText('DATABASE_HEALTHY')).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        'A check that did not run is not a check that passed.',
      ),
    ).not.toBeInTheDocument();
  });
});
