import { getApiBaseUrl } from '@/lib/api/api-base-url';
import { ERROR_CODE_GUIDANCE } from '@/lib/api/error-taxonomy';
import { isAbortError } from '@/lib/api/helpers/is-abort-error';
import { readErrorBody } from '@/lib/api/helpers/read-error-body';
import { StudioError } from '@/lib/api/studio-error';

const ACCEPT_HEADER = 'Accept';
const CONTENT_TYPE_HEADER = 'Content-Type';
const MARKDOWN_MEDIA_TYPE = 'text/markdown';

interface JsonBody {
  isJson: boolean;
  value: unknown;
}

const buildHeaders = (init: RequestInit | undefined): Headers => {
  const headers = new Headers(init?.headers);

  if (!headers.has(ACCEPT_HEADER)) {
    headers.set(ACCEPT_HEADER, MARKDOWN_MEDIA_TYPE);
  }

  return headers;
};

const readJson = async (response: Response): Promise<JsonBody> => {
  try {
    return { isJson: true, value: await response.json() };
  } catch {
    return { isJson: false, value: undefined };
  }
};

export const requestText = async (
  path: string,
  init?: RequestInit,
): Promise<string> => {
  let response: Response;

  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...init,
      headers: buildHeaders(init),
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

  if (!response.ok) {
    const body = await readJson(response);
    const { code, detail } = readErrorBody(body.value);

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

  const mediaType = response.headers.get(CONTENT_TYPE_HEADER);

  if (mediaType === null || !mediaType.startsWith(MARKDOWN_MEDIA_TYPE)) {
    throw new StudioError({
      kind: 'MALFORMED',
      messageKey: 'error.malformedText',
      status: response.status,
    });
  }

  return response.text();
};
