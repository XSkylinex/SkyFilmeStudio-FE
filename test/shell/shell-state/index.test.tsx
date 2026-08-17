import type { FC } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShellStateProvider } from '@/shell/shell-state';
import { useShellState } from '@/shell/shell-state/use-shell-state';
import { SHELL_STATE_NAV_COLLAPSED_STORAGE_KEY } from '@/shell/shell-state/shell-state.constants';

class MockLocalStorage implements Storage {
  private readonly store = new Map<string, string>();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

const installLocalStorage = (storage: Storage | undefined): void => {
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: storage,
  });
};

const NavCollapsedProbe: FC = () => {
  const { navCollapsed, toggleNavCollapsed } = useShellState();

  return (
    <button type="button" onClick={toggleNavCollapsed}>
      {navCollapsed ? 'collapsed' : 'expanded'}
    </button>
  );
};

describe('ShellStateProvider nav-collapse persistence', () => {
  afterEach(() => {
    installLocalStorage(undefined);
  });

  it('renders with the default, expanded nav state when localStorage is unavailable, instead of throwing', () => {
    installLocalStorage(undefined);

    expect(() =>
      render(
        <ShellStateProvider>
          <NavCollapsedProbe />
        </ShellStateProvider>,
      ),
    ).not.toThrow();
    expect(screen.getByRole('button')).toHaveTextContent('expanded');
  });

  it('still toggles, without throwing, when localStorage.setItem fails', async () => {
    installLocalStorage(undefined);
    const user = userEvent.setup();
    render(
      <ShellStateProvider>
        <NavCollapsedProbe />
      </ShellStateProvider>,
    );

    await user.click(screen.getByRole('button'));

    expect(screen.getByRole('button')).toHaveTextContent('collapsed');
  });

  it('persists a toggle to localStorage when it is available', async () => {
    installLocalStorage(new MockLocalStorage());
    const user = userEvent.setup();
    render(
      <ShellStateProvider>
        <NavCollapsedProbe />
      </ShellStateProvider>,
    );

    await user.click(screen.getByRole('button'));

    expect(screen.getByRole('button')).toHaveTextContent('collapsed');
    expect(
      window.localStorage.getItem(SHELL_STATE_NAV_COLLAPSED_STORAGE_KEY),
    ).toBe('true');
  });

  it('reads a previously stored collapsed value back on mount', () => {
    const storage = new MockLocalStorage();
    storage.setItem(SHELL_STATE_NAV_COLLAPSED_STORAGE_KEY, 'true');
    installLocalStorage(storage);

    render(
      <ShellStateProvider>
        <NavCollapsedProbe />
      </ShellStateProvider>,
    );

    expect(screen.getByRole('button')).toHaveTextContent('collapsed');
  });
});

const ThemeProbe: FC = () => {
  const { theme, setTheme } = useShellState();

  return (
    <>
      <p>theme:{theme}</p>
      <button type="button" onClick={() => setTheme('dark')}>
        set theme
      </button>
    </>
  );
};

describe('ShellStateProvider theme', () => {
  it('defaults to the system theme and lets a descendant set it', async () => {
    const user = userEvent.setup();
    render(
      <ShellStateProvider>
        <ThemeProbe />
      </ShellStateProvider>,
    );

    expect(screen.getByText('theme:system')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'set theme' }));

    expect(screen.getByText('theme:dark')).toBeInTheDocument();
  });
});

describe('useShellState outside a provider', () => {
  it('throws a message naming the provider that is missing, not a generic context error', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => render(<NavCollapsedProbe />)).toThrow(/ShellStateProvider/);

    consoleErrorSpy.mockRestore();
  });
});
