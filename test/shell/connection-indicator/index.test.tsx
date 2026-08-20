import { render, screen } from '@testing-library/react';
import { ConnectionIndicator } from '@/shell/connection-indicator';
import { ConnectionStateProvider } from '@/shell/connection-indicator/connection-state-provider';
import { ConnectionStateContext } from '@/shell/connection-indicator/connection-state.context';
import type { ConnectionState } from '@/shell/connection-indicator/connection-indicator.interface';

const renderWithState = (connectionState: ConnectionState): void => {
  render(
    <ConnectionStateContext.Provider
      value={{
        connectionState,
        setConnectionState: vi.fn<(next: ConnectionState) => void>(),
      }}
    >
      <ConnectionIndicator />
    </ConnectionStateContext.Provider>,
  );
};

describe('ConnectionIndicator', () => {
  it('throws a clear error when rendered without a ConnectionStateProvider', () => {
    expect(() => render(<ConnectionIndicator />)).toThrow(
      /ConnectionStateProvider/,
    );
  });

  it('carries the current state on data-state', () => {
    const { container } = render(
      <ConnectionStateContext.Provider
        value={{
          connectionState: 'open',
          setConnectionState: vi.fn<(next: ConnectionState) => void>(),
        }}
      >
        <ConnectionIndicator />
      </ConnectionStateContext.Provider>,
    );

    expect(container.querySelector('.connection-indicator')).toHaveAttribute(
      'data-state',
      'open',
    );
  });

  it('says the orchestrator connection is down in real words, not just a red dot, when closed', () => {
    renderWithState('closed');

    expect(screen.getByText('Disconnected')).toBeInTheDocument();
    expect(
      screen.getByText(/orchestrator process stopped/i),
    ).toBeInTheDocument();
  });

  it('renders distinct text for every connection state', () => {
    const states: ConnectionState[] = [
      'unknown',
      'connecting',
      'open',
      'closed',
      'reconnecting',
    ];
    const labels = new Set<string>();

    states.forEach((state) => {
      const { unmount, container } = render(
        <ConnectionStateContext.Provider
          value={{
            connectionState: state,
            setConnectionState: vi.fn<(next: ConnectionState) => void>(),
          }}
        >
          <ConnectionIndicator />
        </ConnectionStateContext.Provider>,
      );
      const badgeLabel = container.querySelector('.badge__label')?.textContent;
      if (badgeLabel) {
        labels.add(badgeLabel);
      }
      unmount();
    });

    expect(labels.size).toBe(states.length);
  });

  it('starts unknown rather than claiming a connection attempt that has not happened', () => {
    const { container } = render(
      <ConnectionStateProvider>
        <ConnectionIndicator />
      </ConnectionStateProvider>,
    );

    expect(container.querySelector('.connection-indicator')).toHaveAttribute(
      'data-state',
      'unknown',
    );
    expect(screen.getByText('Not yet verified')).toBeInTheDocument();
    expect(screen.queryByText('Connecting')).not.toBeInTheDocument();
  });
});
