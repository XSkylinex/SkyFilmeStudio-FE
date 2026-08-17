import type { UIMatch } from 'react-router-dom';
import type { RouteHandle } from '../interfaces/route-handle';

const isRouteHandle = (handle: unknown): handle is RouteHandle =>
  typeof handle === 'object' &&
  handle !== null &&
  typeof (handle as Partial<RouteHandle>).title === 'string';

export const resolveCurrentRouteTitle = (
  matches: readonly UIMatch[],
): string | null => {
  for (let index = matches.length - 1; index >= 0; index -= 1) {
    const match = matches[index];
    if (match && isRouteHandle(match.handle)) {
      return match.handle.title;
    }
  }

  return null;
};
