import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import type { DiskGate, PreflightReport } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { DiskGatePanel } from '@/features/system/components/disk-gate-panel';
import { renderInApp } from '../../../../render-in-app';
import { buildPreflightReport } from '../../../../fixtures/preflight-report.fixture';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const FAILING_GATE: DiskGate = {
  freeBytes: 8_000_000_000,
  missingModelBytes: 40_000_000_000,
  workingSpaceBytes: 10_000_000_000,
  safetyHeadroomBytes: 5_000_000_000,
  requiredBytes: 55_000_000_000,
  shortfallBytes: 47_000_000_000,
  passed: false,
};

const orchestratorReports = (report: PreflightReport): void => {
  server.use(http.get(API_PATH.preflight(), () => HttpResponse.json(report)));
};

describe('DiskGatePanel', () => {
  it('says in those words that a render will refuse to start, and by how much', async () => {
    orchestratorReports(
      buildPreflightReport({ passed: false, diskGate: FAILING_GATE }),
    );

    renderInApp(<DiskGatePanel />);

    expect(
      await screen.findByText(
        /A render will refuse to start\. This disk is short by:/,
      ),
    ).toBeInTheDocument();
  });

  it('gives every byte figure its own left-to-right direction, so a Hebrew page does not print the unit before the number', async () => {
    orchestratorReports(
      buildPreflightReport({ passed: false, diskGate: FAILING_GATE }),
    );

    renderInApp(<DiskGatePanel />);

    const free = await screen.findByText('8.0 GB');
    expect(free).toHaveAttribute('dir', 'ltr');
    expect(
      screen
        .getAllByText('47.0 GB')
        .every((node) => node.getAttribute('dir') === 'ltr'),
    ).toBe(true);
  });

  it('shows every figure the gate is computed from, so the shortfall can be argued with', async () => {
    orchestratorReports(
      buildPreflightReport({ passed: false, diskGate: FAILING_GATE }),
    );

    renderInApp(<DiskGatePanel />);

    expect(await screen.findByText('Free space')).toBeInTheDocument();
    expect(screen.getByText('8.0 GB')).toBeInTheDocument();
    expect(screen.getByText('Missing model files')).toBeInTheDocument();
    expect(screen.getByText('40.0 GB')).toBeInTheDocument();
    expect(screen.getByText('Working space reserved')).toBeInTheDocument();
    expect(screen.getByText('Safety headroom')).toBeInTheDocument();
    expect(screen.getByText('Required to start')).toBeInTheDocument();
    expect(screen.getByText('55.0 GB')).toBeInTheDocument();
  });

  it('does not show a shortfall row at all when there is no shortfall', async () => {
    orchestratorReports(buildPreflightReport({ passed: true }));

    renderInApp(<DiskGatePanel />);

    expect(
      await screen.findByText(
        'There is enough free space for a render to start.',
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText('Short by')).not.toBeInTheDocument();
  });

  it('renders the failing verdict distinctly enough for a stylesheet to reach, not by colour word alone', async () => {
    orchestratorReports(
      buildPreflightReport({ passed: false, diskGate: FAILING_GATE }),
    );

    const { container } = renderInApp(<DiskGatePanel />);
    await screen.findByText(/refuse to start/);

    expect(
      container.querySelector('.disk-gate-panel__verdict'),
    ).toHaveAttribute('data-passed', 'false');
    expect(
      container.querySelector('[data-shortfall="true"]'),
    ).toBeInTheDocument();
  });

  it('reports that the report could not be read rather than rendering a disk gate of zeroes', async () => {
    server.use(
      http.get(
        API_PATH.preflight(),
        () => new HttpResponse(null, { status: 500 }),
      ),
    );

    renderInApp(<DiskGatePanel />);

    expect(
      await screen.findByText('Preflight could not be read'),
    ).toBeInTheDocument();
    expect(screen.queryByText('0 B')).not.toBeInTheDocument();
  });
});
