import { http, HttpResponse } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { API_PATH } from '@/lib/api/api.constants';
import { SystemPage } from '@/features/system/SystemPage';
import { renderInApp } from '../../render-in-app';
import { buildModelSetupReport } from '../../fixtures/model-setup-report.fixture';
import { buildPreflightReport } from '../../fixtures/preflight-report.fixture';
import { buildSystemMode } from '../../fixtures/system-mode.fixture';
import { mockOrchestratorServer } from '../../lib/api/msw-server';

const requests: string[] = [];

const server = mockOrchestratorServer(
  http.get(API_PATH.preflight(), () => {
    requests.push(API_PATH.preflight());

    return HttpResponse.json(buildPreflightReport({}));
  }),
  http.get(API_PATH.modelSetup(), () => {
    requests.push(API_PATH.modelSetup());

    return HttpResponse.json(buildModelSetupReport());
  }),
  http.get(API_PATH.systemMode(), () => HttpResponse.json(buildSystemMode())),
);

beforeEach(() => {
  requests.length = 0;
});

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

  it('re-reads the model setup as well as preflight, because the orchestrator recomputes both', async () => {
    const user = userEvent.setup();
    renderInApp(<SystemPage />);
    await screen.findByText('Ready to render');
    await waitFor(() => {
      expect(requests).toContain(API_PATH.modelSetup());
    });
    requests.length = 0;

    await user.click(screen.getByRole('button', { name: 'Re-run checks' }));

    await waitFor(() => {
      expect(requests).toContain(API_PATH.preflight());
      expect(requests).toContain(API_PATH.modelSetup());
    });
  });

  it('keeps one heading per panel when every request fails, instead of repeating an h2', async () => {
    server.use(
      http.get(
        API_PATH.preflight(),
        () => new HttpResponse(null, { status: 503 }),
      ),
      http.get(
        API_PATH.modelSetup(),
        () => new HttpResponse(null, { status: 503 }),
      ),
      http.get(
        API_PATH.systemMode(),
        () => new HttpResponse(null, { status: 503 }),
      ),
    );

    renderInApp(<SystemPage />);
    await screen.findAllByText('Preflight could not be read');

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(
      screen
        .getAllByRole('heading', { level: 2 })
        .map((node) => node.textContent),
    ).toEqual([
      'Preflight could not be read',
      'Hardware profile',
      'Disk',
      'Operating mode',
      'Memory and pressure',
      'Runtimes',
      'Preflight',
      'Models',
    ]);
    expect(screen.getAllByRole('heading', { level: 3 }).length).toBeGreaterThan(
      0,
    );
  });

  it('no longer claims the page is not connected to the orchestrator, because it is', () => {
    renderInApp(<SystemPage />);

    expect(
      screen.queryByText(/Not connected to the orchestrator yet/i),
    ).not.toBeInTheDocument();
  });
});
