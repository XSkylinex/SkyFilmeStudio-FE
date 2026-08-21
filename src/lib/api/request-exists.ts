import { getApiBaseUrl } from '@/lib/api/api-base-url';
import { isAbortError } from '@/lib/api/helpers/is-abort-error';
import { StudioError } from '@/lib/api/studio-error';

const NOT_FOUND = 404;

export const requestExists = async (
  path: string,
  init?: RequestInit,
): Promise<boolean> => {
  let response: Response;

  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...init,
      method: 'HEAD',
    });
  } catch (cause) {
    if (isAbortError(cause)) {
      throw cause;
    }

    throw new StudioError({
      kind: 'NETWORK',
      messageKey: 'error.network',
      cause,
    });
  }

  if (response.status === NOT_FOUND) {
    return false;
  }

  if (!response.ok) {
    throw new StudioError({
      kind: 'HTTP',
      messageKey: 'error.status',
      messageValues: { status: response.status },
      status: response.status,
    });
  }

  return true;
};
