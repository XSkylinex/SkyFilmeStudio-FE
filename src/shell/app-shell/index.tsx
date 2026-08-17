import type { FC } from 'react';
import {
  Link,
  NavLink,
  Outlet,
  useMatches,
  useNavigation,
} from 'react-router-dom';
import { ProgressBar } from '@/lib/components/progress-bar';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import { Provider } from 'react-redux';
import { store } from '@/shell/store';
import { ConnectionStateProvider } from '@/shell/connection-indicator/connection-state-provider';
import { ConnectionIndicator } from '@/shell/connection-indicator';
import { OfflineIndicator } from '@/shell/offline-indicator';
import { KeyboardShortcutsProvider } from '@/shell/keyboard/keyboard-shortcuts-provider';
import { RouteTitle } from '@/shell/route-title';
import { Breadcrumbs } from '@/shell/breadcrumbs';
import { resolveCurrentRouteParam } from '@/shell/helpers/resolve-current-route-param';
import {
  PROJECT_ID_PARAM,
  projectListPath,
} from '@/shell/routes/routes.constants';
import { resolveAppShellNavLinks } from './helpers/resolve-app-shell-nav-links';
import { APP_NAME, APP_SHELL_MAIN_ID } from './app-shell.constants';
import './app-shell.css';

export const AppShell: FC = () => {
  const navigation = useNavigation();
  const isNavigating = navigation.state === 'loading';
  const matches = useMatches();
  const projectId = resolveCurrentRouteParam(matches, PROJECT_ID_PARAM);
  const navLinks = resolveAppShellNavLinks(projectId);

  return (
    <Provider store={store}>
      <ConnectionStateProvider>
        <KeyboardShortcutsProvider>
          <RouteTitle />
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
              <Link className="app-shell__brand" to={projectListPath()}>
                {APP_NAME}
              </Link>
              <nav className="app-shell__nav" aria-label="Primary">
                <ul className="app-shell__nav-list">
                  {navLinks.map((link) => (
                    <li key={link.to}>
                      <NavLink className="app-shell__nav-link" to={link.to} end>
                        {link.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
              <OfflineIndicator />
              <ConnectionIndicator />
            </header>
            <main
              className="app-shell__main"
              id={APP_SHELL_MAIN_ID}
              tabIndex={-1}
            >
              <Breadcrumbs />
              <Outlet />
            </main>
          </div>
        </KeyboardShortcutsProvider>
      </ConnectionStateProvider>
    </Provider>
  );
};
