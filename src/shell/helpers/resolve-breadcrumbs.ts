import type { UIMatch } from 'react-router-dom';
import type { Breadcrumb } from '../interfaces/breadcrumb';
import { isRouteHandle } from './is-route-handle';
import { ROOT_PATH } from '../routes/routes.constants';

export const resolveBreadcrumbs = (
  matches: readonly UIMatch[],
): Breadcrumb[] => {
  const byPathname = new Map<string, Breadcrumb>();

  for (const match of matches) {
    if (!isRouteHandle(match.handle) || match.pathname === ROOT_PATH) {
      continue;
    }

    byPathname.set(match.pathname, {
      titleKey: match.handle.titleKey,
      pathname: match.pathname,
    });
  }

  return [...byPathname.values()];
};
