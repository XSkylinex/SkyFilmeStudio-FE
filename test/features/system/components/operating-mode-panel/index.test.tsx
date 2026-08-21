import { http, HttpResponse } from 'msw';
import { screen, within } from '@testing-library/react';
import type { SystemMode } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { OperatingModePanel } from '@/features/system/components/operating-mode-panel';
import { renderInApp } from '../../../../render-in-app';
import { buildSystemMode } from '../../../../fixtures/system-mode.fixture';
import { mockOrchestratorServer } from '../../../../lib/api/msw-server';

const server = mockOrchestratorServer();

const orchestratorReports = (systemMode: SystemMode): void => {
  server.use(
    http.get(API_PATH.systemMode(), () => HttpResponse.json(systemMode)),
  );
};

const rowFor = (label: string): HTMLElement => {
  const row = screen.getByText(label).closest('li');
  if (!row) {
    throw new Error(`no flag row for ${label}`);
  }

  return row;
};

describe('OperatingModePanel', () => {
  it('shows the mode the orchestrator resolved as the identifier it is, not a prettified label', async () => {
    orchestratorReports(
      buildSystemMode({ operatingMode: 'CLAUDE_CODE_CONTEXT_SHARING' }),
    );

    renderInApp(<OperatingModePanel />);

    const mode = await screen.findByText('CLAUDE_CODE_CONTEXT_SHARING');
    expect(mode.tagName).toBe('CODE');
    expect(mode).toHaveAttribute('dir', 'ltr');
  });

  it('shows every flag the mode was computed from, so the resolved value can be understood', async () => {
    orchestratorReports(buildSystemMode({}));

    renderInApp(<OperatingModePanel />);

    expect(
      await screen.findByText('Local-only generation'),
    ).toBeInTheDocument();
    expect(screen.getByText('Strict offline')).toBeInTheDocument();
    expect(screen.getByText('LAN render workers')).toBeInTheDocument();
    expect(screen.getByText('Claude Code operator')).toBeInTheDocument();
    expect(screen.getByText('LM Studio MCP host')).toBeInTheDocument();
  });

  it('tones a flag by what it means rather than by whether it is on', async () => {
    orchestratorReports(
      buildSystemMode({ localOnly: true, allowLanWorkers: true }),
    );

    renderInApp(<OperatingModePanel />);
    await screen.findByText('Local-only generation');

    expect(
      within(rowFor('Local-only generation')).getByText('On').closest('.badge'),
    ).toHaveAttribute('data-tone', 'ready');
    expect(
      within(rowFor('LAN render workers')).getByText('On').closest('.badge'),
    ).toHaveAttribute('data-tone', 'attention');
  });

  it('marks local-only being off as a danger, because it is the promise this product makes', async () => {
    orchestratorReports(
      buildSystemMode({
        localOnly: false,
        operatingMode: 'NON_LOCAL_GENERATION_ENABLED',
      }),
    );

    renderInApp(<OperatingModePanel />);
    await screen.findByText('Local-only generation');

    expect(
      within(rowFor('Local-only generation'))
        .getByText('Off')
        .closest('.badge'),
    ).toHaveAttribute('data-tone', 'danger');
  });

  it('says the LM Studio MCP host is a control surface here rather than a route off the machine', async () => {
    orchestratorReports(buildSystemMode({ lmStudioMcpHostEnabled: true }));

    renderInApp(<OperatingModePanel />);

    expect(await screen.findByText(/not a route off it/)).toBeInTheDocument();
  });

  it('reports that the mode could not be read rather than showing every flag off', async () => {
    server.use(
      http.get(
        API_PATH.systemMode(),
        () => new HttpResponse(null, { status: 500 }),
      ),
    );

    renderInApp(<OperatingModePanel />);

    expect(
      await screen.findByText('The operating mode could not be read'),
    ).toBeInTheDocument();
    expect(screen.queryByText('Local-only generation')).not.toBeInTheDocument();
  });
});
