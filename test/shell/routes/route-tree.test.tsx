import {
  createMemoryRouter,
  matchRoutes,
  RouterProvider,
} from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from '@/shell/store';
import { routeTree } from '@/shell/routes/route-tree';
import { NotFoundPage } from '@/shell/routes/not-found-page';
import { RootErrorBoundary } from '@/shell/root-error-boundary';
import {
  productionAudioPath,
  productionPath,
  productionPlanPath,
  productionShotPath,
  productionShotsPath,
  productionStoryboardPath,
  productionTimelinePath,
  projectDashboardPath,
  projectListPath,
  subjectReviewPath,
  systemPath,
} from '@/shell/routes/routes.constants';

interface FlatRoute {
  path: string | undefined;
  hasErrorBoundary: boolean;
  isLazy: boolean;
  hasHydrateFallback: boolean;
}

const flattenRoutes = (routes: RouteObject[]): FlatRoute[] =>
  routes.flatMap((route) => [
    {
      path: route.path,
      hasErrorBoundary: route.ErrorBoundary != null,
      isLazy: typeof route.lazy === 'function',
      hasHydrateFallback: route.HydrateFallback != null,
    },
    ...(route.children ? flattenRoutes(route.children) : []),
  ]);

const renderInStore = (ui: ReactElement): ReturnType<typeof render> =>
  render(<Provider store={createStore()}>{ui}</Provider>);

describe('routeTree', () => {
  const flatRoutes = flattenRoutes(routeTree);

  it('gives every route an ErrorBoundary so one failed screen cannot blank the app', () => {
    expect(flatRoutes.length).toBeGreaterThan(0);
    expect(flatRoutes.every((route) => route.hasErrorBoundary)).toBe(true);
  });

  it('keeps every media-heavy route, plus the design-system gallery, lazy with a skeleton HydrateFallback', () => {
    const lazyRoutes = flatRoutes.filter((route) => route.isLazy);
    const lazyPaths = lazyRoutes
      .map((route) => route.path)
      .sort((a, b) => (a ?? '').localeCompare(b ?? ''));

    expect(lazyPaths).toEqual([
      'audio',
      'design-system',
      'shots',
      'shots/:shotId',
      'storyboard',
      'timeline',
    ]);
    expect(lazyRoutes.every((route) => route.hasHydrateFallback)).toBe(true);
  });

  it('gives the root route a boundary that survives a shell-level failure, distinct from a leaf page boundary', () => {
    expect(routeTree[0]?.ErrorBoundary).toBe(RootErrorBoundary);
  });

  it('redirects the bare production URL to its plan stage', async () => {
    const memoryRouter = createMemoryRouter(routeTree, {
      initialEntries: [productionPath('proj-1', 'prod-1')],
    });

    renderInStore(<RouterProvider router={memoryRouter} />);

    expect(
      await screen.findByRole('heading', { name: 'Plan', level: 1 }),
    ).toBeInTheDocument();
    expect(memoryRouter.state.location.pathname).toBe(
      productionPlanPath('proj-1', 'prod-1'),
    );
  });

  it('replaces the production-index redirect instead of pushing it, so Back escapes on the first press', async () => {
    const memoryRouter = createMemoryRouter(routeTree, {
      initialEntries: [projectListPath(), productionPath('proj-1', 'prod-1')],
      initialIndex: 1,
    });

    renderInStore(<RouterProvider router={memoryRouter} />);

    expect(
      await screen.findByRole('heading', { name: 'Plan', level: 1 }),
    ).toBeInTheDocument();
    expect(memoryRouter.state.historyAction).toBe('REPLACE');

    await memoryRouter.navigate(-1);

    expect(memoryRouter.state.location.pathname).toBe(projectListPath());
  });

  it('resolves a URL built by productionShotPath back to the shot review route', () => {
    const url = productionShotPath('proj-1', 'prod-1', 'shot-1');
    const shotMatch = matchRoutes(routeTree, url)?.at(-1);

    expect(shotMatch?.params).toEqual({
      projectId: 'proj-1',
      productionId: 'prod-1',
      shotId: 'shot-1',
    });
    expect(typeof shotMatch?.route.lazy).toBe('function');
  });

  it('resolves the dashboard, a subject review deep link and /system', () => {
    expect(
      matchRoutes(routeTree, projectDashboardPath('proj-1')),
    ).not.toBeNull();
    expect(
      matchRoutes(routeTree, subjectReviewPath('proj-1', 'subj-1'))?.at(-1)
        ?.params,
    ).toEqual({ projectId: 'proj-1', subjectId: 'subj-1' });
    expect(matchRoutes(routeTree, systemPath())?.at(-1)?.route.path).toBe(
      'system',
    );
  });

  it('falls back to the not-found page for an unmatched path', () => {
    const notFoundMatch = matchRoutes(
      routeTree,
      '/this/path/does-not-exist',
    )?.at(-1);

    expect(notFoundMatch?.route.Component).toBe(NotFoundPage);
  });
});

describe('the design-system gallery route', () => {
  it('still renders at /design-system, lazily', async () => {
    const memoryRouter = createMemoryRouter(routeTree, {
      initialEntries: ['/design-system'],
    });

    renderInStore(<RouterProvider router={memoryRouter} />);

    expect(
      await screen.findByRole('heading', { name: 'Design system preview' }),
    ).toBeInTheDocument();
  });
});

describe('the media-heavy lazy routes, rendered through the router so their route.lazy mapper actually runs', () => {
  it('resolves the storyboard route to StoryboardPage', async () => {
    const memoryRouter = createMemoryRouter(routeTree, {
      initialEntries: [productionStoryboardPath('proj-1', 'prod-1')],
    });

    renderInStore(<RouterProvider router={memoryRouter} />);

    expect(
      await screen.findByRole('heading', { name: 'Storyboard', level: 1 }),
    ).toBeInTheDocument();
  });

  it('resolves the shots list route to ShotsPage', async () => {
    const memoryRouter = createMemoryRouter(routeTree, {
      initialEntries: [productionShotsPath('proj-1', 'prod-1')],
    });

    renderInStore(<RouterProvider router={memoryRouter} />);

    expect(
      await screen.findByRole('heading', { name: 'Shots', level: 1 }),
    ).toBeInTheDocument();
  });

  it('resolves the shot review route to ShotReviewPage', async () => {
    const memoryRouter = createMemoryRouter(routeTree, {
      initialEntries: [productionShotPath('proj-1', 'prod-1', 'shot-1')],
    });

    renderInStore(<RouterProvider router={memoryRouter} />);

    expect(
      await screen.findByRole('heading', { name: 'Shot review', level: 1 }),
    ).toBeInTheDocument();
  });

  it('resolves the audio route to AudioPage', async () => {
    const memoryRouter = createMemoryRouter(routeTree, {
      initialEntries: [productionAudioPath('proj-1', 'prod-1')],
    });

    renderInStore(<RouterProvider router={memoryRouter} />);

    expect(
      await screen.findByRole('heading', { name: 'Audio', level: 1 }),
    ).toBeInTheDocument();
  });

  it('resolves the timeline route to TimelinePage', async () => {
    const memoryRouter = createMemoryRouter(routeTree, {
      initialEntries: [productionTimelinePath('proj-1', 'prod-1')],
    });

    renderInStore(<RouterProvider router={memoryRouter} />);

    expect(
      await screen.findByRole('heading', { name: 'Timeline', level: 1 }),
    ).toBeInTheDocument();
  });
});
