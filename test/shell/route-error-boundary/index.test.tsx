import { createRoutesStub } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { RouteErrorBoundary } from '@/shell/route-error-boundary';

describe('RouteErrorBoundary', () => {
  it('renders the backend error code as an actionable sentence, and always shows the raw code too', async () => {
    const Stub = createRoutesStub([
      {
        path: '/',
        loader: () => {
          throw Response.json({ code: 'DISK_SPACE_LOW' }, { status: 507 });
        },
        Component: () => null,
        ErrorBoundary: RouteErrorBoundary,
      },
    ]);

    render(<Stub initialEntries={['/']} />);

    expect(await screen.findByText(/low on disk space/i)).toBeInTheDocument();
    expect(screen.getByText('DISK_SPACE_LOW')).toBeInTheDocument();
  });

  it('falls back to a generic sentence for an unrecognised code, but still shows the raw code', async () => {
    const Stub = createRoutesStub([
      {
        path: '/',
        loader: () => {
          throw Response.json({ code: 'SOME_FUTURE_CODE' }, { status: 500 });
        },
        Component: () => null,
        ErrorBoundary: RouteErrorBoundary,
      },
    ]);

    render(<Stub initialEntries={['/']} />);

    expect(await screen.findByText('SOME_FUTURE_CODE')).toBeInTheDocument();
    expect(
      screen.getByText(/does not yet have a message for/i),
    ).toBeInTheDocument();
  });

  it('keeps the shell alive and shows a message for a plain render error with no typed backend code', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const Stub = createRoutesStub([
      {
        path: '/',
        Component: () => {
          throw new Error('boom');
        },
        ErrorBoundary: RouteErrorBoundary,
      },
    ]);

    render(<Stub initialEntries={['/']} />);

    expect(screen.getByText("This page couldn't load")).toBeInTheDocument();
    expect(screen.getByText('boom')).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});
