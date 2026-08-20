import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import { hardwareProfileIdSchema } from 'sky-filme-studio-be/contracts';
import type { PreflightReport } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { HardwareProfilePanel } from '@/features/system/components/hardware-profile-panel';
import { renderInApp } from '../../../../render-in-app';
import { buildPreflightReport } from '../../../../fixtures/preflight-report.fixture';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const orchestratorReports = (report: PreflightReport): void => {
  server.use(http.get(API_PATH.preflight(), () => HttpResponse.json(report)));
};

describe('HardwareProfilePanel', () => {
  it('names the profile exactly as the orchestrator does, and marks it as machine text', async () => {
    orchestratorReports(
      buildPreflightReport({
        hardwareProfileId: hardwareProfileIdSchema.parse(
          'mac-m5-max-40gpu-64gb',
        ),
      }),
    );

    renderInApp(<HardwareProfilePanel />);

    const profile = await screen.findByText('mac-m5-max-40gpu-64gb');
    expect(profile.tagName).toBe('CODE');
    expect(profile).toHaveAttribute('dir', 'ltr');
  });

  it('treats an unrecognised machine as a failure, not as a blank panel', async () => {
    orchestratorReports(buildPreflightReport({}));

    renderInApp(<HardwareProfilePanel />);

    expect(
      await screen.findByText('This machine matches no known hardware profile'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Renders refuse to start without one/),
    ).toBeInTheDocument();
  });

  it('says the acceleration backend and measured capabilities are not published, rather than implying there are none', async () => {
    orchestratorReports(
      buildPreflightReport({
        hardwareProfileId: hardwareProfileIdSchema.parse(
          'pc-285k-rtx4080-16gb-96gb',
        ),
      }),
    );

    renderInApp(<HardwareProfilePanel />);

    expect(
      await screen.findByText(/not published by the orchestrator yet/),
    ).toBeInTheDocument();
  });

  it('never shows the unknown-profile failure while a profile is known', async () => {
    orchestratorReports(
      buildPreflightReport({
        hardwareProfileId: hardwareProfileIdSchema.parse(
          'mac-m5-max-40gpu-64gb',
        ),
      }),
    );

    renderInApp(<HardwareProfilePanel />);

    await screen.findByText('mac-m5-max-40gpu-64gb');
    expect(
      screen.queryByText('This machine matches no known hardware profile'),
    ).not.toBeInTheDocument();
  });
});
