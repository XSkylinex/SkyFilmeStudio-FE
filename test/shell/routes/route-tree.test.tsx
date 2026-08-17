import {
  createMemoryRouter,
  matchRoutes,
  RouterProvider,
} from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { routeTree } from '@/shell/routes/route-tree';
import { NotFoundPage } from '@/shell/routes/not-found-page';
import {
  productionShotPath,
  projectDashboardPath,
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

describe('routeTree', () => {
  const flatRoutes = flattenRoutes(routeTree);

  it('gives every route an ErrorBoundary so one failed screen cannot blank the app', () => {
    expect(flatRoutes.length).toBeGreaterThan(0);
    expect(flatRoutes.every((route) => route.hasErrorBoundary)).toBe(true);
  });

  it('keeps exactly the five media-heavy routes lazy, each with a skeleton HydrateFallback', () => {
    const lazyRoutes = flatRoutes.filter((route) => route.isLazy);
    const lazyPaths = lazyRoutes
      .map((route) => route.path)
      .sort((a, b) => (a ?? '').localeCompare(b ?? ''));

    expect(lazyPaths).toEqual([
      'audio',
      'shots',
      'shots/:shotId',
      'storyboard',
      'timeline',
    ]);
    expect(lazyRoutes.every((route) => route.hasHydrateFallback)).toBe(true);
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
  it('still renders at /design-system', () => {
    const memoryRouter = createMemoryRouter(routeTree, {
      initialEntries: ['/design-system'],
    });

    render(<RouterProvider router={memoryRouter} />);

    expect(
      screen.getByRole('heading', { name: 'Design system preview' }),
    ).toBeInTheDocument();
  });
});
