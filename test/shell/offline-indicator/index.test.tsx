import { render, screen } from '@testing-library/react';
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
    const { container: strictContainer } = render(
      <OfflineIndicator
        offlineMode={{ ...BASE_OFFLINE_MODE, strictOffline: true }}
      />,
    );
    const { container: operatorContainer } = render(
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
    render(
      <OfflineIndicator
        offlineMode={{ ...BASE_OFFLINE_MODE, claudeCodeOperatorEnabled: true }}
      />,
    );

    expect(screen.getByText(/can leave this machine/i)).toBeInTheDocument();
  });

  it('says the operator is disabled under strict offline, without a blanket "nothing can leave" claim', () => {
    render(
      <OfflineIndicator
        offlineMode={{ ...BASE_OFFLINE_MODE, strictOffline: true }}
      />,
    );

    expect(screen.getByText(/strict offline mode is on/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/nothing about this project can leave this machine/i),
    ).not.toBeInTheDocument();
  });

  it('reports LAN workers as a live concern even while strict offline is also on, instead of a single absolute claim', () => {
    render(
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
    const { container } = render(<OfflineIndicator />);

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
    const { container } = render(
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
});
