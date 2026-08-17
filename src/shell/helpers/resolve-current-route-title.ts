import type { UIMatch } from 'react-router-dom';
import { isRouteHandle } from './is-route-handle';

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
