const ABORT_ERROR_NAME = 'AbortError';

export const isAbortError = (error: unknown): boolean =>
  typeof error === 'object' &&
  error !== null &&
  (error as { name?: unknown }).name === ABORT_ERROR_NAME;
