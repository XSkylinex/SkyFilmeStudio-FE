import type { FC } from 'react';
import { Link, createRoutesStub } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppShell } from '@/shell/app-shell';
import {
  projectAssetsPath,
  projectListPath,
  systemPath,
} from '@/shell/routes/routes.constants';

const HomePage: FC = () => <Link to="/slow">Go slow</Link>;
const SlowPage: FC = () => <p>slow page arrived</p>;
const AssetsPageStub: FC = () => <p>assets page arrived</p>;

describe('AppShell', () => {
  it('renders a skip link pointing at the main content region, as the first focusable element', () => {
    const Stub = createRoutesStub([
      {
        path: '/',
        Component: AppShell,
        children: [{ index: true, Component: () => <p>home</p> }],
      },
    ]);

    render(<Stub initialEntries={['/']} />);

    const skipLink = screen.getByRole('link', {
      name: 'Skip to main content',
    });
    expect(skipLink).toHaveAttribute('href', '#app-shell-main');
    expect(document.getElementById('app-shell-main')).toBeInTheDocument();
  });

  it('renders the offline indicator and the connection indicator in the header', () => {
    const Stub = createRoutesStub([
      {
        path: '/',
        Component: AppShell,
        children: [{ index: true, Component: () => <p>home</p> }],
      },
    ]);

    render(<Stub initialEntries={['/']} />);

    expect(document.querySelector('.offline-indicator')).toBeInTheDocument();
    expect(document.querySelector('.connection-indicator')).toBeInTheDocument();
  });

  it('marks the navigation-progress affordance pending during a same-session navigation, and clears it on arrival', async () => {
    let resolveLoader: (() => void) | undefined;
    const user = userEvent.setup();
    const Stub = createRoutesStub([
      {
        path: '/',
        Component: AppShell,
        children: [
          { index: true, Component: HomePage },
          {
            path: 'slow',
            loader: () =>
              new Promise<null>((resolve) => {
                resolveLoader = () => resolve(null);
              }),
            Component: SlowPage,
          },
        ],
      },
    ]);

    render(<Stub initialEntries={['/']} />);
    const progress = document.querySelector('.app-shell__navigation-progress');
    expect(progress).toHaveAttribute('data-pending', 'false');

    await user.click(screen.getByRole('link', { name: 'Go slow' }));

    expect(progress).toHaveAttribute('data-pending', 'true');
    expect(screen.queryByText('slow page arrived')).not.toBeInTheDocument();

    resolveLoader?.();

    expect(await screen.findByText('slow page arrived')).toBeInTheDocument();
    expect(progress).toHaveAttribute('data-pending', 'false');
  });

  it('gives the skip link somewhere programmatically focusable to land on', () => {
    const Stub = createRoutesStub([
      {
        path: '/',
        Component: AppShell,
        children: [{ index: true, Component: () => <p>home</p> }],
      },
    ]);

    render(<Stub initialEntries={['/']} />);

    expect(document.getElementById('app-shell-main')).toHaveAttribute(
      'tabindex',
      '-1',
    );
  });

  it('links the brand text home and reaches the project list and /system by keyboard, with no project in the URL', () => {
    const Stub = createRoutesStub([
      {
        path: '/',
        Component: AppShell,
        children: [{ index: true, Component: () => <p>home</p> }],
      },
    ]);

    render(<Stub initialEntries={['/']} />);

    expect(
      screen.getByRole('link', { name: 'Local AI Studio' }),
    ).toHaveAttribute('href', projectListPath());
    expect(screen.getByRole('link', { name: 'System' })).toHaveAttribute(
      'href',
      systemPath(),
    );
    expect(
      screen.queryByRole('link', { name: 'Assets' }),
    ).not.toBeInTheDocument();
  });

  it('adds the project-scoped destinations, built from the path helpers, once a project id is in the URL', () => {
    const Stub = createRoutesStub([
      {
        path: '/',
        Component: AppShell,
        children: [
          {
            path: 'projects/:projectId/assets',
            Component: AssetsPageStub,
          },
        ],
      },
    ]);

    render(<Stub initialEntries={['/projects/proj-1/assets']} />);

    expect(screen.getByRole('link', { name: 'Assets' })).toHaveAttribute(
      'href',
      projectAssetsPath('proj-1'),
    );
    expect(screen.getByRole('link', { name: 'Assets' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByText('assets page arrived')).toBeInTheDocument();
  });

  it('does not mark an ancestor nav link as the current page when a deeper route is active', () => {
    const Stub = createRoutesStub([
      {
        path: '/',
        Component: AppShell,
        children: [
          {
            path: 'projects/:projectId/productions',
            Component: () => <p>productions list</p>,
          },
          {
            path: 'projects/:projectId/productions/:productionId/storyboard',
            Component: () => <p>storyboard page</p>,
          },
        ],
      },
    ]);

    render(
      <Stub
        initialEntries={['/projects/proj-1/productions/prod-1/storyboard']}
      />,
    );

    expect(screen.getByText('storyboard page')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Productions' }),
    ).not.toHaveAttribute('aria-current');
  });

  it('sets the document title from the matched route and falls back to the app name', () => {
    const Stub = createRoutesStub([
      {
        path: '/',
        Component: AppShell,
        children: [
          {
            index: true,
            Component: () => <p>home</p>,
            handle: { title: 'Projects' },
          },
        ],
      },
    ]);

    render(<Stub initialEntries={['/']} />);

    expect(document.title).toBe('Projects · Local AI Studio');
  });
});
