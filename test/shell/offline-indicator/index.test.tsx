import { http, HttpResponse } from 'msw';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import type { OperatingMode, SystemMode } from 'sky-filme-studio-be/contracts';
import { API_PATH } from '@/lib/api/api.constants';
import { OfflineIndicator } from '@/shell/offline-indicator';
import { renderInApp } from '../../render-in-app';
import { buildSystemMode } from '../../fixtures/system-mode.fixture';
import { mockOrchestratorServer } from '../../lib/api/msw-server';

const server = mockOrchestratorServer();

const OPERATING_MODES: readonly OperatingMode[] = [
  'LOCAL_ONLY',
  'STRICT_OFFLINE',
  'CLAUDE_CODE_CONTEXT_SHARING',
  'NON_LOCAL_GENERATION_ENABLED',
];

const orchestratorReports = (systemMode: SystemMode): void => {
  server.use(
    http.get(API_PATH.systemMode(), () => HttpResponse.json(systemMode)),
  );
};

const indicator = (): Element | null =>
  document.querySelector('.offline-indicator');

describe('OfflineIndicator', () => {
  it('reports the mode the orchestrator returns rather than a local guess', async () => {
    orchestratorReports(
      buildSystemMode({ operatingMode: 'CLAUDE_CODE_CONTEXT_SHARING' }),
    );

    renderInApp(<OfflineIndicator />);

    expect(
      await screen.findByText(/can leave this machine/i),
    ).toBeInTheDocument();
    expect(indicator()).toHaveAttribute('data-mode', 'operator-enabled');
  });

  it('is visually and textually distinct between strict-offline and operator-enabled', async () => {
    orchestratorReports(buildSystemMode({ operatingMode: 'STRICT_OFFLINE' }));
    renderInApp(<OfflineIndicator />);
    expect(
      await screen.findByText(/strict offline mode is on/i),
    ).toBeInTheDocument();
    const strictMode = indicator()?.getAttribute('data-mode');

    orchestratorReports(
      buildSystemMode({ operatingMode: 'CLAUDE_CODE_CONTEXT_SHARING' }),
    );
    renderInApp(<OfflineIndicator />);
    expect(
      await screen.findByText(/can leave this machine/i),
    ).toBeInTheDocument();

    expect(strictMode).toBe('strict-offline');
    expect(strictMode).not.toBe('operator-enabled');
  });

  it('says nothing about the operator being disabled while describing strict offline', async () => {
    orchestratorReports(buildSystemMode({ operatingMode: 'STRICT_OFFLINE' }));

    renderInApp(<OfflineIndicator />);

    expect(
      await screen.findByText(/strict offline mode is on/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/nothing about this project can leave this machine/i),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/operator is disabled/i)).not.toBeInTheDocument();
  });

  it('marks LAN workers on the element as well as in the text, so a green headline cannot read as an absolute', async () => {
    orchestratorReports(
      buildSystemMode({ operatingMode: 'LOCAL_ONLY', allowLanWorkers: true }),
    );

    renderInApp(<OfflineIndicator />);

    expect(
      await screen.findByText(
        /render workers on the local network are allowed/i,
      ),
    ).toBeInTheDocument();
    expect(indicator()).toHaveAttribute('data-mode', 'local');
    expect(indicator()).toHaveAttribute('data-lan-workers', 'true');
  });

  it('claims nothing while the orchestrator has not answered yet', () => {
    orchestratorReports(buildSystemMode({ operatingMode: 'LOCAL_ONLY' }));

    renderInApp(<OfflineIndicator />);

    expect(indicator()).toHaveAttribute('data-mode', 'unknown');
    expect(screen.getByText(/has not been confirmed yet/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/no render or context leaves this machine/i),
    ).not.toBeInTheDocument();
  });

  it('claims nothing when the orchestrator refuses the request either', async () => {
    server.use(
      http.get(
        API_PATH.systemMode(),
        () => new HttpResponse(null, { status: 500 }),
      ),
    );

    renderInApp(<OfflineIndicator />);

    expect(
      await screen.findByText(/has not been confirmed yet/i),
    ).toBeInTheDocument();
    expect(indicator()).toHaveAttribute('data-mode', 'unknown');
  });

  it('puts the same tone on the badge and the dot it carries', async () => {
    orchestratorReports(buildSystemMode({ operatingMode: 'STRICT_OFFLINE' }));

    renderInApp(<OfflineIndicator />);

    expect(
      await screen.findByText(/strict offline mode is on/i),
    ).toBeInTheDocument();
    expect(document.querySelector('.badge')).toHaveAttribute(
      'data-tone',
      'success',
    );
    expect(document.querySelector('.status-dot')).toHaveAttribute(
      'data-tone',
      'success',
    );
  });
});

describe('OfflineIndicator across every operating mode', () => {
  OPERATING_MODES.forEach((operatingMode) => {
    [false, true].forEach((allowLanWorkers) => {
      it(`says exactly what ${operatingMode} means, and nothing another mode means, with LAN workers ${allowLanWorkers ? 'allowed' : 'refused'}`, async () => {
        orchestratorReports(
          buildSystemMode({ operatingMode, allowLanWorkers }),
        );

        const { container } = renderInApp(<OfflineIndicator />);

        await waitForElementToBeRemoved(() =>
          screen.queryByText(/has not been confirmed yet/i),
        );
        const text = container.textContent ?? '';

        expect(text.includes('can leave this machine through Claude')).toBe(
          operatingMode === 'CLAUDE_CODE_CONTEXT_SHARING',
        );
        expect(text.includes('Strict offline mode is on')).toBe(
          operatingMode === 'STRICT_OFFLINE',
        );
        expect(text.includes('not running local-only')).toBe(
          operatingMode === 'NON_LOCAL_GENERATION_ENABLED',
        );
        expect(text.includes('No render or context leaves this machine')).toBe(
          operatingMode === 'LOCAL_ONLY',
        );
        expect(
          text.includes('Render workers on the local network are allowed'),
        ).toBe(allowLanWorkers);
      });
    });
  });
});
