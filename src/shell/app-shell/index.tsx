import type { FC } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';
import { ProgressBar } from '@/lib/components/progress-bar';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import { ShellStateProvider } from '@/shell/shell-state';
import { ConnectionStateProvider } from '@/shell/connection-indicator/connection-state-provider';
import { ConnectionIndicator } from '@/shell/connection-indicator';
import { OfflineIndicator } from '@/shell/offline-indicator';
import { OFFLINE_MODE_FIXTURE } from '@/shell/offline-indicator/offline-indicator.constants';
import { KeyboardShortcutsProvider } from '@/shell/keyboard/keyboard-shortcuts-provider';
import { APP_SHELL_MAIN_ID } from './app-shell.constants';
import './app-shell.css';

export const AppShell: FC = () => {
  const navigation = useNavigation();
  const isNavigating = navigation.state === 'loading';

  return (
    <ShellStateProvider>
      <ConnectionStateProvider>
        <KeyboardShortcutsProvider>
          <div className="app-shell">
            <a className="app-shell__skip-link" href={`#${APP_SHELL_MAIN_ID}`}>
              Skip to main content
            </a>
            <div
              className="app-shell__navigation-progress"
              data-pending={isNavigating}
            >
              <ProgressBar
                label="Loading page"
                tone={STATUS_TONE.ACTIVE}
                indeterminate
              />
            </div>
            <header className="app-shell__header">
              <span>Local AI Studio</span>
              <OfflineIndicator offlineMode={OFFLINE_MODE_FIXTURE} />
              <ConnectionIndicator />
            </header>
            <main className="app-shell__main" id={APP_SHELL_MAIN_ID}>
              <Outlet />
            </main>
          </div>
        </KeyboardShortcutsProvider>
      </ConnectionStateProvider>
    </ShellStateProvider>
  );
};
