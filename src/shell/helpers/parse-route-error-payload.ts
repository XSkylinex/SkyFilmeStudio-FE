import type { RouteErrorPayload } from '../interfaces/route-error-payload';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const toRecord = (data: unknown): Record<string, unknown> | null => {
  if (isRecord(data)) {
    return data;
  }
  if (typeof data !== 'string') {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(data);
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const parseRouteErrorPayload = (
  data: unknown,
): RouteErrorPayload | null => {
  const record = toRecord(data);
  if (!record) {
    return null;
  }

  const { code, message } = record;
  if (typeof code !== 'string') {
    return null;
  }

  return {
    code,
    message: typeof message === 'string' ? message : undefined,
  };
};
