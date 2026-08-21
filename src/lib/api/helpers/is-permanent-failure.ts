import { StudioError } from '@/lib/api/studio-error';

const CLIENT_ERROR_FLOOR = 400;
const CLIENT_ERROR_CEILING = 500;

export const isPermanentFailure = (error: unknown): boolean => {
  if (!(error instanceof StudioError)) {
    return false;
  }

  if (error.kind === 'CONTRACT' || error.kind === 'MALFORMED') {
    return true;
  }

  if (error.code !== undefined) {
    return true;
  }

  return (
    error.status !== undefined &&
    error.status >= CLIENT_ERROR_FLOOR &&
    error.status < CLIENT_ERROR_CEILING
  );
};
