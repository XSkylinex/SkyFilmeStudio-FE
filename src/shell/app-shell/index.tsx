import type { FC } from 'react';
import {
  Link,
  NavLink,
  Outlet,
  useMatches,
  useNavigation,
} from 'react-router-dom';
import { Button } from '@/lib/components/button';
import { ProgressBar } from '@/lib/components/progress-bar';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import { ConnectionStateProvider } from '@/shell/connection-indicator/connection-state-provider';
import { ConnectionIndicator } from '@/shell/connection-indicator';
import { OfflineIndicator } from '@/shell/offline-indicator';
import { InterfaceLanguageSelect } from '@/shell/interface-language-select';
import { useTranslate } from '@/lib/i18n/use-translate';
import { KeyboardShortcutsProvider } from '@/shell/keyboard/keyboard-shortcuts-provider';
import { RouteTitle } from '@/shell/route-title';
import { Breadcrumbs } from '@/shell/breadcrumbs';
import { resolveCurrentRouteParam } from '@/shell/helpers/resolve-current-route-param';
import {
  PROJECT_ID_PARAM,
  projectListPath,
} from '@/shell/routes/routes.constants';
import { useAppDispatch, useAppSelector } from '@/shell/store/hooks';
import { navCollapsedToggled, selectNavCollapsed } from '@/shell/shell.slice';
import { resolveAppShellNavLinks } from './helpers/resolve-app-shell-nav-links';
import {
  APP_NAME,
  APP_SHELL_MAIN_ID,
  APP_SHELL_NAV_ID,
} from './app-shell.constants';
import './app-shell.css';

export const AppShell: FC = () => {
  const navigation = useNavigation();
  const isNavigating = navigation.state === 'loading';
  const matches = useMatches();
  const projectId = resolveCurrentRouteParam(matches, PROJECT_ID_PARAM);
  const navCollapsed = useAppSelector(selectNavCollapsed);
  const dispatch = useAppDispatch();
  const navLinks = resolveAppShellNavLinks(projectId);
  const translate = useTranslate();

  return (
    <ConnectionStateProvider>
      <KeyboardShortcutsProvider>
        <RouteTitle />
        <div className="app-shell">
          <a className="app-shell__skip-link" href={`#${APP_SHELL_MAIN_ID}`}>
            {translate('shell.skipToMain')}
          </a>
          <div
            className="app-shell__navigation-progress"
            data-pending={isNavigating}
          >
            <ProgressBar
              label={translate('shell.loadingPage')}
              tone={STATUS_TONE.ACTIVE}
              indeterminate
            />
          </div>
          <header className="app-shell__header">
            <Link className="app-shell__brand" to={projectListPath()}>
              {APP_NAME}
            </Link>
            <Button
              variant="ghost"
              size="sm"
              aria-expanded={!navCollapsed}
              aria-controls={APP_SHELL_NAV_ID}
              onClick={() => dispatch(navCollapsedToggled())}
            >
              {navCollapsed
                ? translate('shell.showNavigation')
                : translate('shell.hideNavigation')}
            </Button>
            <nav
              className="app-shell__nav"
              id={APP_SHELL_NAV_ID}
              aria-label={translate('shell.primaryNavigation')}
              data-collapsed={navCollapsed}
            >
              <ul className="app-shell__nav-list">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink className="app-shell__nav-link" to={link.to} end>
                      {translate(link.labelKey)}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
            <InterfaceLanguageSelect />
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
  );
};
