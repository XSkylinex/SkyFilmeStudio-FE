import type { ZodType } from 'zod';
import { getApiBaseUrl } from '@/lib/api/api-base-url';
import { ERROR_CODE_GUIDANCE } from '@/lib/api/error-taxonomy';
import { isAbortError } from '@/lib/api/helpers/is-abort-error';
import { readErrorBody } from '@/lib/api/helpers/read-error-body';
import { StudioError } from '@/lib/api/studio-error';

const ACCEPT_HEADER = 'Accept';
const JSON_MEDIA_TYPE = 'application/json';
interface JsonBody {
  isJson: boolean;
  value: unknown;
}

const buildHeaders = (init: RequestInit | undefined): Headers => {
  const headers = new Headers(init?.headers);

  if (!headers.has(ACCEPT_HEADER)) {
    headers.set(ACCEPT_HEADER, JSON_MEDIA_TYPE);
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

export const requestJson = async <T>(
  path: string,
  schema: ZodType<T>,
  init?: RequestInit,
): Promise<T> => {
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
      sentence:
        'The orchestrator is not answering. It is the process that runs every render, so nothing can start until it is back.',
      cause,
    });
  }

  const body = await readJson(response);

  if (!response.ok) {
    const { code, detail } = readErrorBody(body.value);

    throw new StudioError({
      kind: 'HTTP',
      sentence:
        code === undefined
          ? `The orchestrator refused this request with status ${response.status}.`
          : ERROR_CODE_GUIDANCE[code].sentence,
      code,
      status: response.status,
      detail,
    });
  }

  if (!body.isJson) {
    throw new StudioError({
      kind: 'MALFORMED',
      sentence:
        'Something other than the orchestrator answered this request: the reply was not JSON. Check that this path reaches the orchestrator rather than the page server.',
      status: response.status,
      detail: response.headers.get('Content-Type') ?? undefined,
    });
  }

  const parsed = schema.safeParse(body.value);

  if (!parsed.success) {
    throw new StudioError({
      kind: 'CONTRACT',
      sentence:
        'The orchestrator answered with a shape this build does not recognise. The two halves are on different contract versions.',
      status: response.status,
      detail: parsed.error.issues
        .map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
        .join('; '),
    });
  }

  return parsed.data;
};
