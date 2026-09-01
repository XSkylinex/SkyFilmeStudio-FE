import { getApiBaseUrl } from '@/lib/api/api-base-url';
import { ERROR_CODE_GUIDANCE } from '@/lib/api/error-taxonomy';
import { isAbortError } from '@/lib/api/helpers/is-abort-error';
import { readErrorBody } from '@/lib/api/helpers/read-error-body';
import { StudioError } from '@/lib/api/studio-error';

const readBody = async (response: Response): Promise<unknown> => {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
};

export const requestNoContent = async (
  path: string,
  init?: RequestInit,
): Promise<void> => {
  let response: Response;

  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, init);
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

  if (!response.ok) {
    const { code, detail } = readErrorBody(await readBody(response));

    throw new StudioError({
      kind: 'HTTP',
      messageKey:
        code === undefined
          ? 'error.status'
          : ERROR_CODE_GUIDANCE[code].messageKey,
      messageValues: { status: response.status },
      code,
      status: response.status,
      detail,
    });
  }
};
