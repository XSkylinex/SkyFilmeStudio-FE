import type { FC } from 'react';
import {
  Link,
  Outlet,
  RouterProvider,
  createMemoryRouter,
} from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouteFocus } from '@/shell/route-focus';
import { APP_SHELL_MAIN_ID } from '@/shell/app-shell/app-shell.constants';

const TestShell: FC = () => (
  <>
    <RouteFocus />
    <nav>
      <Link to="/system">System</Link>
    </nav>
    <main id={APP_SHELL_MAIN_ID} tabIndex={-1}>
      <Outlet />
    </main>
  </>
);

const renderAt = (initialPath: string): void => {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <TestShell />,
        children: [
          { index: true, element: <h1>Projects</h1> },
          { path: 'system', element: <h1>System</h1> },
        ],
      },
    ],
    { initialEntries: [initialPath] },
  );

  render(<RouterProvider router={router} />);
};

describe('RouteFocus', () => {
  it('leaves focus alone on the first paint, since the reader has not navigated', () => {
    renderAt('/system');

    expect(document.activeElement).toBe(document.body);
  });

  it('moves focus to the main region when a navigation lands', async () => {
    const user = userEvent.setup();
    renderAt('/');

    const link = screen.getByRole('link', { name: 'System' });
    link.focus();
    expect(document.activeElement).toBe(link);

    await user.click(link);

    expect(
      await screen.findByRole('heading', { name: 'System' }),
    ).toBeInTheDocument();
    expect(document.activeElement).toHaveAttribute('id', APP_SHELL_MAIN_ID);
  });
});
