import type { UIMatch } from 'react-router-dom';
import type { Breadcrumb } from '../interfaces/breadcrumb';
import type { RouteHandle } from '../interfaces/route-handle';
import { ROOT_PATH } from '../routes/routes.constants';

const isRouteHandle = (handle: unknown): handle is RouteHandle =>
  typeof handle === 'object' &&
  handle !== null &&
  typeof (handle as Partial<RouteHandle>).title === 'string';

export const resolveBreadcrumbs = (
  matches: readonly UIMatch[],
): Breadcrumb[] => {
  const byPathname = new Map<string, Breadcrumb>();

  for (const match of matches) {
    if (!isRouteHandle(match.handle) || match.pathname === ROOT_PATH) {
      continue;
    }

    byPathname.set(match.pathname, {
      title: match.handle.title,
      pathname: match.pathname,
    });
  }

  return [...byPathname.values()];
};
