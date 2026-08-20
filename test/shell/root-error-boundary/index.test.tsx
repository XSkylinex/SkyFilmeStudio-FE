import { createRoutesStub } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RootErrorBoundary } from '@/shell/root-error-boundary';

describe('RootErrorBoundary', () => {
  it('offers a reload and does not claim the rest of the app is unaffected when the shell itself fails', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const reloadSpy = vi.fn<() => void>();
    vi.stubGlobal('location', { reload: reloadSpy });
    const user = userEvent.setup();

    const Stub = createRoutesStub([
      {
        path: '/',
        Component: () => {
          throw new Error('shell render failed');
        },
        ErrorBoundary: RootErrorBoundary,
      },
    ]);

    render(<Stub initialEntries={['/']} />);

    expect(
      screen.getByText('Local AI Studio hit an unrecoverable error'),
    ).toBeInTheDocument();
    expect(screen.getByText('shell render failed')).toBeInTheDocument();
    expect(screen.queryByText(/is unaffected/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Reload' }));
    expect(reloadSpy).toHaveBeenCalledTimes(1);

    consoleErrorSpy.mockRestore();
    vi.unstubAllGlobals();
  });

  it('renders the typed backend code as the detail when the shell fails on a typed error', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const Stub = createRoutesStub([
      {
        path: '/',
        loader: () => {
          throw Response.json({ code: 'DISK_SPACE_LOW' }, { status: 507 });
        },
        Component: () => null,
        ErrorBoundary: RootErrorBoundary,
      },
    ]);

    render(<Stub initialEntries={['/']} />);

    expect(await screen.findByText('DISK_SPACE_LOW')).toBeInTheDocument();
    expect(screen.getByText(/low on disk space/i)).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it('keeps its own generic description, not the route-level "is unaffected" claim, for an untyped shell failure', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const Stub = createRoutesStub([
      {
        path: '/',
        Component: () => {
          throw new Error('shell render failed');
        },
        ErrorBoundary: RootErrorBoundary,
      },
    ]);

    render(<Stub initialEntries={['/']} />);

    expect(
      screen.getByText(
        'Reload the app. If this keeps happening, check that the orchestrator is still running.',
      ),
    ).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});
