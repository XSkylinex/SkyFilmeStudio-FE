import { parseRouteErrorPayload } from './parse-route-error-payload';
import { toRouteErrorResponse } from './to-route-error-response';
import {
  ROUTE_ERROR_CODE_MESSAGE,
  ROUTE_ERROR_DEFAULT_MESSAGE,
} from '../route-error-messages.fixture';
import type { RouteErrorPayload } from '../interfaces/route-error-payload';
import type { RouteErrorResponse } from '../interfaces/route-error-response';
import type { RouteErrorView } from '../interfaces/route-error-view';

const GENERIC_ROUTE_ERROR_DESCRIPTION =
  'Something failed while rendering this page. The rest of Local AI Studio is unaffected.';

const CIRCULAR_REFERENCE_MARKER = '[Circular]';

const createCircularSafeReplacer = (): ((
  key: string,
  value: unknown,
) => unknown) => {
  const seen = new WeakSet<object>();

  return (_key, value) => {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return CIRCULAR_REFERENCE_MARKER;
      }
      seen.add(value);
    }
    return value;
  };
};

const describeUnknownError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  try {
    return JSON.stringify(error, createCircularSafeReplacer());
  } catch {
    if (error !== null && typeof error === 'object') {
      const keys = Object.keys(error);
      return `An error object that could not be serialised (keys: ${
        keys.length > 0 ? keys.join(', ') : 'none'
      }).`;
    }
    return String(error);
  }
};

const describeRouteErrorPayload = (payload: RouteErrorPayload): string => {
  if (!payload.code) {
    return payload.message ?? ROUTE_ERROR_DEFAULT_MESSAGE;
  }

  const baseDescription =
    ROUTE_ERROR_CODE_MESSAGE[payload.code] ?? ROUTE_ERROR_DEFAULT_MESSAGE;

  return payload.message
    ? `${baseDescription} (${payload.message})`
    : baseDescription;
};

const resolveRouteErrorResponseView = (
  errorResponse: RouteErrorResponse,
): RouteErrorView => {
  const payload = parseRouteErrorPayload(errorResponse.data);
  const statusText = errorResponse.statusText || undefined;

  if (payload) {
    return {
      detail: payload.code ?? statusText ?? `HTTP_${errorResponse.status}`,
      description: describeRouteErrorPayload(payload),
      isUnknownError: false,
    };
  }

  const rawBody =
    typeof errorResponse.data === 'string' ? errorResponse.data.trim() : '';

  return {
    detail: statusText ?? `HTTP_${errorResponse.status}`,
    description: rawBody
      ? `The orchestrator responded with ${errorResponse.status}: ${rawBody}`
      : `The orchestrator responded with ${errorResponse.status}${statusText ? ` ${statusText}` : ''}.`,
    isUnknownError: false,
  };
};

export const resolveRouteErrorView = (error: unknown): RouteErrorView => {
  const errorResponse = toRouteErrorResponse(error);
  if (errorResponse) {
    return resolveRouteErrorResponseView(errorResponse);
  }

  const payload = parseRouteErrorPayload(error);
  if (payload) {
    return {
      detail: payload.code ?? describeUnknownError(error),
      description: describeRouteErrorPayload(payload),
      isUnknownError: false,
    };
  }

  return {
    detail: describeUnknownError(error),
    description: GENERIC_ROUTE_ERROR_DESCRIPTION,
    isUnknownError: true,
  };
};
