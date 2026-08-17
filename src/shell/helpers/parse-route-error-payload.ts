import type { RouteErrorPayload } from '../interfaces/route-error-payload';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const parseRouteErrorPayload = (
  data: unknown,
): RouteErrorPayload | null => {
  if (!isRecord(data)) {
    return null;
  }

  const { code, message } = data;
  if (typeof code !== 'string') {
    return null;
  }

  return {
    code,
    message: typeof message === 'string' ? message : undefined,
  };
};
