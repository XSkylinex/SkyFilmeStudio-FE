import { EN_CATALOGUE } from '@/lib/i18n/catalogue/en';
import { createRoutesStub } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { renderInStore } from '../../render-in-store';
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

    renderInStore(<Stub initialEntries={['/']} />);

    expect(
      await screen.findByText(EN_CATALOGUE['error.DISK_SPACE_LOW']),
    ).toBeInTheDocument();
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

    renderInStore(<Stub initialEntries={['/']} />);

    expect(await screen.findByText('SOME_FUTURE_CODE')).toBeInTheDocument();
    expect(
      screen.getByText(/does not yet have a message for/i),
    ).toBeInTheDocument();
  });

  it('recovers the code from a JSON body thrown without a content-type header', async () => {
    const Stub = createRoutesStub([
      {
        path: '/',
        loader: () => {
          throw new Response(JSON.stringify({ code: 'DISK_SPACE_LOW' }), {
            status: 507,
          });
        },
        Component: () => null,
        ErrorBoundary: RouteErrorBoundary,
      },
    ]);

    renderInStore(<Stub initialEntries={['/']} />);

    expect(
      await screen.findByText(EN_CATALOGUE['error.DISK_SPACE_LOW']),
    ).toBeInTheDocument();
    expect(screen.getByText('DISK_SPACE_LOW')).toBeInTheDocument();
  });

  it('shows the raw response body instead of a dangling status sentence for a plain-text error', async () => {
    const Stub = createRoutesStub([
      {
        path: '/',
        loader: () => {
          throw new Response('disk full', {
            status: 507,
            headers: { 'content-type': 'text/plain' },
          });
        },
        Component: () => null,
        ErrorBoundary: RouteErrorBoundary,
      },
    ]);

    renderInStore(<Stub initialEntries={['/']} />);

    expect(await screen.findByText(/disk full/i)).toBeInTheDocument();
  });

  it('does not render a dangling status sentence when statusText is empty and there is no message either', async () => {
    const Stub = createRoutesStub([
      {
        path: '/',
        loader: () => {
          throw Response.json({}, { status: 500 });
        },
        Component: () => null,
        ErrorBoundary: RouteErrorBoundary,
      },
    ]);

    renderInStore(<Stub initialEntries={['/']} />);

    const description = await screen.findByText(/orchestrator/i);
    expect(description.textContent).toBe(
      EN_CATALOGUE['error.status'].replace('{status}', '500'),
    );
  });

  it('renders the message from a body with no code, the shape NestJS sends by default', async () => {
    const Stub = createRoutesStub([
      {
        path: '/',
        loader: () => {
          throw Response.json(
            { statusCode: 503, message: 'The orchestrator is restarting' },
            { status: 503 },
          );
        },
        Component: () => null,
        ErrorBoundary: RouteErrorBoundary,
      },
    ]);

    renderInStore(<Stub initialEntries={['/']} />);

    const description = await screen.findByText(/orchestrator is restarting/i);
    expect(description.textContent).toBe('The orchestrator is restarting');
  });

  it('shows the backend message alongside the canned description for a known code', async () => {
    const Stub = createRoutesStub([
      {
        path: '/',
        loader: () => {
          throw Response.json(
            {
              code: 'DISK_SPACE_LOW',
              message: '2.1 GB free on /Volumes/Media',
            },
            { status: 507 },
          );
        },
        Component: () => null,
        ErrorBoundary: RouteErrorBoundary,
      },
    ]);

    renderInStore(<Stub initialEntries={['/']} />);

    expect(
      await screen.findByText(/2\.1 GB free on \/Volumes\/Media/),
    ).toBeInTheDocument();
  });

  it('reads the code off a thrown plain object instead of stringifying it', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const Stub = createRoutesStub([
      {
        path: '/',
        Component: () => {
          throw { code: 'DISK_SPACE_LOW', detail: 'x' };
        },
        ErrorBoundary: RouteErrorBoundary,
      },
    ]);

    renderInStore(<Stub initialEntries={['/']} />);

    expect(
      screen.getByText(EN_CATALOGUE['error.DISK_SPACE_LOW']),
    ).toBeInTheDocument();
    expect(screen.getByText('DISK_SPACE_LOW')).toBeInTheDocument();
    expect(screen.queryByText('[object Object]')).not.toBeInTheDocument();

    consoleErrorSpy.mockRestore();
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

    renderInStore(<Stub initialEntries={['/']} />);

    expect(screen.getByText("This page couldn't load")).toBeInTheDocument();
    expect(screen.getByText('boom')).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});
