import type { FC } from 'react';
import { Link, createRoutesStub } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppShell } from '@/shell/app-shell';

const HomePage: FC = () => <Link to="/slow">Go slow</Link>;
const SlowPage: FC = () => <p>slow page arrived</p>;

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
});
