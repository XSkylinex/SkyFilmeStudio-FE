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

  it('says nothing can leave the machine under strict offline', () => {
    render(
      <OfflineIndicator
        offlineMode={{ ...BASE_OFFLINE_MODE, strictOffline: true }}
      />,
    );

    expect(
      screen.getByText(/nothing about this project can leave this machine/i),
    ).toBeInTheDocument();
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
