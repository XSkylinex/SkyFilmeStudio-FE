import { screen } from '@testing-library/react';
import { renderInStore } from '../../render-in-store';
import { OfflineIndicator } from '@/shell/offline-indicator';
import type { OfflineMode } from '@/shell/offline-indicator/offline-indicator.interface';

const BASE_OFFLINE_MODE: OfflineMode = {
  localOnly: true,
  strictOffline: false,
  allowLanWorkers: false,
  claudeCodeOperatorEnabled: false,
};

describe('OfflineIndicator', () => {
  it('is visually and textually distinct between strict-offline and operator-enabled', () => {
    const { container: strictContainer } = renderInStore(
      <OfflineIndicator
        offlineMode={{ ...BASE_OFFLINE_MODE, strictOffline: true }}
      />,
    );
    const { container: operatorContainer } = renderInStore(
      <OfflineIndicator
        offlineMode={{ ...BASE_OFFLINE_MODE, claudeCodeOperatorEnabled: true }}
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
        offlineMode={{ ...BASE_OFFLINE_MODE, claudeCodeOperatorEnabled: true }}
      />,
    );

    expect(screen.getByText(/can leave this machine/i)).toBeInTheDocument();
  });

  it('describes strict offline on its own terms, without a blanket "nothing can leave" claim or a claim about the operator flag', () => {
    renderInStore(
      <OfflineIndicator
        offlineMode={{ ...BASE_OFFLINE_MODE, strictOffline: true }}
      />,
    );

    expect(screen.getByText(/strict offline mode is on/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/nothing about this project can leave this machine/i),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/operator is disabled/i)).not.toBeInTheDocument();
  });

  it('never says the operator is disabled while the operator flag itself is enabled, even under strict offline', () => {
    renderInStore(
      <OfflineIndicator
        offlineMode={{
          ...BASE_OFFLINE_MODE,
          strictOffline: true,
          claudeCodeOperatorEnabled: true,
        }}
      />,
    );

    expect(screen.getByText(/can leave this machine/i)).toBeInTheDocument();
    expect(screen.queryByText(/operator is disabled/i)).not.toBeInTheDocument();
  });

  it('reports LAN workers as a live concern even while strict offline is also on, instead of a single absolute claim', () => {
    renderInStore(
      <OfflineIndicator
        offlineMode={{
          ...BASE_OFFLINE_MODE,
          strictOffline: true,
          allowLanWorkers: true,
        }}
      />,
    );

    expect(
      screen.getByText(/render workers on the local network are allowed/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/strict offline mode is on/i)).toBeInTheDocument();
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
        offlineMode={{ ...BASE_OFFLINE_MODE, strictOffline: true }}
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

  it('still mentions Claude when the build is not local-only, instead of the remote fact swallowing it', () => {
    renderInStore(
      <OfflineIndicator
        offlineMode={{
          ...BASE_OFFLINE_MODE,
          localOnly: false,
          claudeCodeOperatorEnabled: true,
        }}
      />,
    );

    expect(screen.getByText(/not running local-only/i)).toBeInTheDocument();
    expect(screen.getByText(/can leave this machine/i)).toBeInTheDocument();
  });
});

describe('OfflineIndicator across every flag combination', () => {
  const ALL_OFFLINE_MODE_COMBINATIONS: readonly OfflineMode[] = Array.from(
    { length: 16 },
    (_, bits): OfflineMode => ({
      localOnly: (bits & 1) !== 0,
      strictOffline: (bits & 2) !== 0,
      allowLanWorkers: (bits & 4) !== 0,
      claudeCodeOperatorEnabled: (bits & 8) !== 0,
    }),
  );

  ALL_OFFLINE_MODE_COMBINATIONS.forEach((offlineMode) => {
    it(`shows exactly its own true flags, never one another's, for ${JSON.stringify(offlineMode)}`, () => {
      const { container, unmount } = renderInStore(
        <OfflineIndicator offlineMode={offlineMode} />,
      );
      const text = container.textContent ?? '';

      expect(text.includes('can leave this machine through Claude')).toBe(
        offlineMode.claudeCodeOperatorEnabled,
      );
      expect(
        text.includes('Render workers on the local network are allowed'),
      ).toBe(offlineMode.allowLanWorkers);
      expect(text.includes('Strict offline mode is on')).toBe(
        offlineMode.strictOffline,
      );
      expect(text.includes('not running local-only')).toBe(
        !offlineMode.localOnly,
      );

      unmount();
    });
  });
});
