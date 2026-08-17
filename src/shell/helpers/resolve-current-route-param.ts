import type { UIMatch } from 'react-router-dom';

export const resolveCurrentRouteParam = (
  matches: readonly UIMatch[],
  paramName: string,
): string | null => {
  const deepestMatch = matches[matches.length - 1];
  if (!deepestMatch) {
    return null;
  }

  const value = deepestMatch.params[paramName];
  return typeof value === 'string' ? value : null;
};
