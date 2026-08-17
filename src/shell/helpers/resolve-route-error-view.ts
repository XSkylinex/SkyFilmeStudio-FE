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

const describeUnknownError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
};

const describeRouteErrorPayload = (payload: RouteErrorPayload): string => {
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
  if (payload) {
    return {
      detail: payload.code,
      description: describeRouteErrorPayload(payload),
    };
  }

  const statusText = errorResponse.statusText || undefined;
  const rawBody =
    typeof errorResponse.data === 'string' ? errorResponse.data.trim() : '';

  return {
    detail: statusText ?? `HTTP_${errorResponse.status}`,
    description: rawBody
      ? `The orchestrator responded with ${errorResponse.status}: ${rawBody}`
      : `The orchestrator responded with ${errorResponse.status}${statusText ? ` ${statusText}` : ''}.`,
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
      detail: payload.code,
      description: describeRouteErrorPayload(payload),
    };
  }

  return {
    detail: describeUnknownError(error),
    description: GENERIC_ROUTE_ERROR_DESCRIPTION,
  };
};
