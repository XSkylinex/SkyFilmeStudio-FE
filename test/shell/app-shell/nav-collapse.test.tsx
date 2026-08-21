import type { FC } from 'react';
import { http, HttpResponse } from 'msw';
import { createRoutesStub } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppShell } from '@/shell/app-shell';
import { API_PATH } from '@/lib/api/api.constants';
import { SHELL_STATE_NAV_COLLAPSED_STORAGE_KEY } from '@/shell/shell-state.constants';
import { renderInApp } from '../../render-in-app';
import { buildSystemMode } from '../../fixtures/system-mode.fixture';
import { mockOrchestratorServer } from '../../lib/api/msw-server';

mockOrchestratorServer(
  http.get(API_PATH.systemMode(), () => HttpResponse.json(buildSystemMode())),
);

const HomePage: FC = () => <p>home</p>;

const stubStorage = (): Map<string, string> => {
  const entries = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => entries.get(key) ?? null,
    setItem: (key: string, value: string) => {
      entries.set(key, value);
    },
  });

  return entries;
};

const renderShell = (): void => {
  const Stub = createRoutesStub([
    {
      path: '/',
      Component: AppShell,
      children: [{ index: true, Component: HomePage }],
    },
  ]);

  renderInApp(<Stub initialEntries={['/']} />);
};

describe('the navigation collapse control', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('hides the primary navigation and says so, rather than only changing a stored value', async () => {
    const user = userEvent.setup();
    stubStorage();
    renderShell();

    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(nav).toHaveAttribute('data-collapsed', 'false');

    await user.click(screen.getByRole('button', { name: 'Hide navigation' }));

    expect(nav).toHaveAttribute('data-collapsed', 'true');
    expect(
      screen.getByRole('button', { name: 'Show navigation' }),
    ).toBeInTheDocument();
  });

  it('tells assistive technology what it controls and whether it is open', async () => {
    const user = userEvent.setup();
    stubStorage();
    renderShell();

    const toggle = screen.getByRole('button', { name: 'Hide navigation' });
    const nav = screen.getByRole('navigation', { name: 'Primary' });

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(toggle).toHaveAttribute('aria-controls', nav.id);

    await user.click(toggle);

    expect(
      screen.getByRole('button', { name: 'Show navigation' }),
    ).toHaveAttribute('aria-expanded', 'false');
  });

  it('persists the choice, so a reload does not reopen a nav the user closed', async () => {
    const user = userEvent.setup();
    const entries = stubStorage();
    renderShell();

    await user.click(screen.getByRole('button', { name: 'Hide navigation' }));

    expect(entries.get(SHELL_STATE_NAV_COLLAPSED_STORAGE_KEY)).toBe('true');
  });
});
