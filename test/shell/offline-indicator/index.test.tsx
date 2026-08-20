import { screen } from '@testing-library/react';
import type { OperatingMode } from 'sky-filme-studio-be/contracts';
import { renderInStore } from '../../render-in-store';
import { OfflineIndicator } from '@/shell/offline-indicator';
import { buildSystemMode } from '../../fixtures/system-mode.fixture';

const OPERATING_MODES: readonly OperatingMode[] = [
  'LOCAL_ONLY',
  'STRICT_OFFLINE',
  'CLAUDE_CODE_CONTEXT_SHARING',
  'NON_LOCAL_GENERATION_ENABLED',
];

describe('OfflineIndicator', () => {
  it('is visually and textually distinct between strict-offline and operator-enabled', () => {
    const { container: strictContainer } = renderInStore(
      <OfflineIndicator
        offlineMode={buildSystemMode({ operatingMode: 'STRICT_OFFLINE' })}
      />,
    );
    const { container: operatorContainer } = renderInStore(
      <OfflineIndicator
        offlineMode={buildSystemMode({
          operatingMode: 'CLAUDE_CODE_CONTEXT_SHARING',
        })}
      />,
    );

    const strictMode = strictContainer.querySelector('.offline-indicator');
    const operatorMode = operatorContainer.querySelector('.offline-indicator');

    expect(strictMode).toHaveAttribute('data-mode', 'strict-offline');
    expect(operatorMode).toHaveAttribute('data-mode', 'operator-enabled');
    expect(strictMode?.getAttribute('data-mode')).not.toBe(
      operatorMode?.getAttribute('data-mode'),
    );
  });

  it('says in real text, not just a tone, that context can leave the machine when the operator is enabled', () => {
    renderInStore(
      <OfflineIndicator
        offlineMode={buildSystemMode({
          operatingMode: 'CLAUDE_CODE_CONTEXT_SHARING',
        })}
      />,
    );

    expect(screen.getByText(/can leave this machine/i)).toBeInTheDocument();
  });

  it('describes strict offline on its own terms, without a blanket "nothing can leave" claim or a claim about the operator flag', () => {
    renderInStore(
      <OfflineIndicator
        offlineMode={buildSystemMode({ operatingMode: 'STRICT_OFFLINE' })}
      />,
    );

    expect(screen.getByText(/strict offline mode is on/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/nothing about this project can leave this machine/i),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/operator is disabled/i)).not.toBeInTheDocument();
  });

  it('never says the operator is disabled while the orchestrator reports context sharing', () => {
    renderInStore(
      <OfflineIndicator
        offlineMode={buildSystemMode({
          operatingMode: 'CLAUDE_CODE_CONTEXT_SHARING',
          strictOffline: true,
        })}
      />,
    );

    expect(screen.getByText(/can leave this machine/i)).toBeInTheDocument();
    expect(screen.queryByText(/operator is disabled/i)).not.toBeInTheDocument();
  });

  it('marks LAN workers on the element as well as in the text, so a green headline cannot read as an absolute', () => {
    const { container } = renderInStore(
      <OfflineIndicator
        offlineMode={buildSystemMode({
          operatingMode: 'LOCAL_ONLY',
          allowLanWorkers: true,
        })}
      />,
    );
    const indicator = container.querySelector('.offline-indicator');

    expect(indicator).toHaveAttribute('data-mode', 'local');
    expect(indicator).toHaveAttribute('data-lan-workers', 'true');
    expect(
      screen.getByText(/render workers on the local network are allowed/i),
    ).toBeInTheDocument();
  });

  it('renders an unverified, non-safety-claiming mode when no offline payload has arrived yet', () => {
    const { container } = renderInStore(<OfflineIndicator />);

    expect(container.querySelector('.offline-indicator')).toHaveAttribute(
      'data-mode',
      'unknown',
    );
    expect(screen.getByText(/has not been confirmed yet/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/no render or context leaves this machine/i),
    ).not.toBeInTheDocument();
  });

  it('puts the same tone on the badge and the dot it carries', () => {
    const { container } = renderInStore(
      <OfflineIndicator
        offlineMode={buildSystemMode({ operatingMode: 'STRICT_OFFLINE' })}
      />,
    );

    expect(container.querySelector('.badge')).toHaveAttribute(
      'data-tone',
      'success',
    );
    expect(container.querySelector('.status-dot')).toHaveAttribute(
      'data-tone',
      'success',
    );
  });
});

describe('OfflineIndicator across every operating mode', () => {
  OPERATING_MODES.forEach((operatingMode) => {
    [false, true].forEach((allowLanWorkers) => {
      it(`says exactly what ${operatingMode} means, and nothing another mode means, with LAN workers ${allowLanWorkers ? 'allowed' : 'refused'}`, () => {
        const { container, unmount } = renderInStore(
          <OfflineIndicator
            offlineMode={buildSystemMode({ operatingMode, allowLanWorkers })}
          />,
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

        unmount();
      });
    });
  });
});
